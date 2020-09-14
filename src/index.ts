#!/usr/bin/env node
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios'
import {CookieJar} from 'tough-cookie'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import * as htmlparser from 'htmlparser2'
import {Node} from 'domhandler'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as soup from 'soupselect'
import {STS} from 'aws-sdk'
import * as et from 'elementtree'
import {sleep, writeAwsProfile} from './lib/util'
import { CONFIG_PROMPT, USER_PASS_PROMPT } from './lib/types'
import type {
  Config,
  Credentials,
  FactorInquire,
  FactorType,
  OktaAuth,
  OktaAuthResponse,
  OktaFactor,
  STSAssumeRole,
} from './lib/types'
import {prompt, QuestionCollection} from 'inquirer'
import * as keytar from 'keytar'
// import { program, Command } from 'commander'
//
// program
//     .command('order <type>') // sub-command name, coffeeType = type, required
//     .alias('o') // alternative sub-command is `o`
//     .description('Order a coffee') // command description
//     .option('-u, --user [value]', 'Okta Username')
//     .option('-p, --passowrd [value]', 'Okta Password')
//
// // allow commander to parse `process.argv`
// program.parse(process.argv)

export class ExtAws {
    assertion: string
    httpAssertion: string
    b64Assertion: string
    rawAssertion: string
    document: et.ElementTree
    client: AxiosInstance
    sts: STS
    sessionToken: string
    config: Config

    constructor() {
      this.assertion = ''
      this.httpAssertion = ''
      this.b64Assertion = ''
      this.document = {} as et.ElementTree
      this.rawAssertion = ''
      this.sts = new STS()
      this.sessionToken = ''
      this.client = {} as AxiosInstance
      this.config = {} as Config
    }

    /**
     * Generate a unique string to service as a device token for Okta logins
     * @returns 32 character string
     */
    generateDeviceToken(length: number): string {
      return [...Array(length)].map(()=>(~~(Math.random()*36)).toString(36)).join('')
    }

    /**
     * Prompts the user to select a MFA token from the provided array
     * @param factors - List of factors provided in Okta authentication response
     *
     * @returns Okta ID of the selected factor
     */
    private static async selectToken(factors: OktaFactor[]): Promise<string> {
      if (factors.length === 0) throw new Error('No factors provided')
      if (factors.length === 1) return factors[0].id
      const factorList = factors.map( factor => {
        const name = factor.profile.name || factor.factorType
        return { name, value: factor.id}
      })
      const { factor } = await ExtAws.inquire<FactorInquire>([{
        name: 'factor',
        type: 'list',
        message: 'Please select MFA factor',
        choices: factorList,
      }])
      return factor
    }

    /**
     * Function that handles processing MFA when required
     * @param authResponse - The response body from the Okta authentication call
     *
     * @returns nothing
     */
    protected async handleMFA(authResponse: OktaAuthResponse): Promise<void | never> {
      if ((authResponse._embedded?.factors !== undefined && authResponse.stateToken !== undefined)) {
        const factor = await ExtAws.selectToken(authResponse._embedded.factors)
        let counter = 0
        let verify: OktaAuthResponse | AxiosError
        do {
          verify = await this.verifyFactor({ id: factor, stateToken: authResponse.stateToken})
          if (!('status' in verify)) {
            throw new Error(verify.message)
          }
          counter++
          if (verify.status !== 'SUCCESS') sleep(1000)
          if (counter > 30) {
            console.log('Timing out after thirty seconds')
            console.log(verify.status)
          }
        } while(verify.status !== 'SUCCESS' && verify.stateToken)
        if (!verify.sessionToken) {
          throw new Error('No session token in response')
        }
        this.sessionToken = verify.sessionToken
      } else {
        throw new Error('Unable to find factors in auth response')
      }
      return
    }

    /**
     * Prompts the user to select an IAM role to assume from the provided list
     * @param roles - Array of STS typed roles
     *
     * @returns The selected role
     */
    private static async selectRole(roles: STSAssumeRole[]): Promise<STSAssumeRole> {
      if (roles.length === 1) return roles[0]
      const roleList = roles.map( (role, index) => {
        const roleName = role.role.split('/')
        return { name: roleName[roleName.length -1], value: index}
      })
      const role = await ExtAws.inquire<number>([{
        name: 'role',
        type: 'list',
        message: 'Please select the role to assume',
        choices: roleList,
      }])
      return roles[role]
    }

    /**
     * Returns the stored credentials, if any, and prompts the user if not present. Also generates a device token
     * @returns Username, password, and device token
     */
    private async getCredentials(): Promise<Credentials | null> {
      const savedCreds = await this.localSecrets('GET', 'extaws', 'config')
      let credentials = null
      if (!savedCreds) {
        const { username, password } = await ExtAws.inquire<Credentials>(USER_PASS_PROMPT)
        const deviceToken = this.generateDeviceToken(32)
        credentials = { username, password, deviceToken }
      } else {
        if (!('username' in (savedCreds as any))) {
          credentials = savedCreds as Credentials
          if (!credentials.deviceToken) {
            credentials.deviceToken = this.generateDeviceToken(32)
          }
        }
      }
      return credentials
    }

    /**
     * Deletes any stored user credentials
     * @returns True if deleted and false if entry wasn't found
     */
    async clearCredentials(): Promise<boolean> {
      keytar.deletePassword('extaws', 'config')
      return keytar.deletePassword('extaws', 'okta')
    }

    /**
     * This loads the stored configuration, if any, and prompts the user if not found.
     * It will then attempt to store the data for future use
     * @returns Object with configuration for Okta and user details
     */
    async getConfig(): Promise<Config> {
      const storedConfig = await keytar.getPassword('extaws', 'config')
      let config: Config
      if (!storedConfig) {
        config = await ExtAws.inquire<Config>(CONFIG_PROMPT)
        await this.setConfig(config)
      } else {
        config = JSON.parse(storedConfig)
      }
      return config
    }

    createAxiosClient(): void {
      this.client = axios.create({
        withCredentials: true,
        baseURL: `https://${this.config.oktaOrgName}.okta.com`,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      axiosCookieJarSupport(this.client)
      this.client.defaults.jar = new CookieJar()
    }

    /**
     * Main method for logging a user into AWS via Okta. Will log a user in and write credentials to aws profile
     * @returns AWS Credentials
     */
    async login(): Promise<STS.Types.AssumeRoleWithSAMLResponse> {
      this.config = await this.getConfig()
      this.createAxiosClient()

      const credentials = await this.getCredentials()
      if (!credentials) throw new Error('Error retrieving stored credentials')
      const authResponse = await this.oktaLogin(credentials)
      if (!('status' in authResponse)) throw new Error(authResponse.message)

      await this.localSecrets('SET', 'extaws', 'okta', credentials)

      switch(authResponse.status) {
      case 'SUCCESS':
        if (!authResponse.sessionToken) {
          throw new Error('No session token in response')
        }
        this.sessionToken = authResponse.sessionToken
        break
      case 'MFA_REQUIRED':
        await this.handleMFA(authResponse)
        break
      case 'MFA_CHALLENGE':
        await this.handleMFA(authResponse)
        break
      default:
        throw new Error(`Unable to handle state: ${authResponse.status}`)
      }

      await this.getSessionCookie()
      await this.getSamlHtml(this.config.oktaSamlUrl)
      await this.parseAssertionFromHtml()
      const roles = await this.parseRolesFromXML()
      const userRole = await ExtAws.selectRole(roles)
      const creds = await this.assumeRole(userRole)
      if (!creds.Credentials) throw new Error('Error during role assumption')
      await writeAwsProfile(this.config.defaultProfile, this.config.awsRegion, creds.Credentials)
      return creds
    }

    async localSecrets<T>(operation: 'GET' | 'SET' | 'DELETE', service: string, account: string, data?: T): Promise<boolean | void | null | string | T> {
      let result: boolean | void | null | string | T
      switch(operation) {
      case 'SET':
        result = await keytar.setPassword(service, account, JSON.stringify(data))
        break
      case 'GET':
        result = await keytar.getPassword(service, account)
        if (typeof result === 'string') {
          result = JSON.parse(result) as T
        }
        break
      case 'DELETE':
        result = await keytar.deletePassword(service, account)
        break
      }
      return result
    }

    /**
     * Handles the initial login to Okta
     * @param credentials - username, password, and device token
     *
     * @returns The response object or axios error
     */
    private async oktaLogin(credentials: Credentials): Promise<OktaAuthResponse | AxiosError> {
      const params: OktaAuth = {
        username: credentials.username,
        password: credentials.password,
        context: {
          deviceToken: credentials.deviceToken || ''
        }
      }
      try {
        const response = await this.client.post<OktaAuthResponse>('/api/v1/authn', params)
        return response.data
      } catch (err) {
        if (err && err.response) {
          return err as AxiosError
        }
        throw err
      }
    }

    /**
     * Makes the factors api call to initiate the MFA process when necessary
     * @param factor
     */
    protected async verifyFactor(factor: FactorType): Promise<OktaAuthResponse | AxiosError> {
      try {
        const res = await this.client.post<OktaAuthResponse>(
          `/api/v1/authn/factors/${factor.id}/verify`,
          { stateToken: factor.stateToken})
        return res.data
      } catch (err) {
        if (err && err.response) {
          return err as AxiosError
        }
        throw err
      }
    }

    private async getSessionCookie() {
      try {
        return await this.client.get<AxiosResponse>('/login/sessionCookieRedirect', {
          params: {
            token: this.sessionToken,
            redirectUrl: `https://${this.config.oktaOrgName}.okta.com${this.config.oktaSamlUrl}`
          }}
        )
      } catch (err) {
        if (err && err.response) {
          return err as AxiosError
        }
        return err
      }
    }

    private async getSamlHtml(samlUrl: string): Promise<string | AxiosError> {
      try {
        const res = await this.client.get<string>(samlUrl)
        this.httpAssertion = res.data
        return res.data
      } catch (err) {
        if (err && err.response) {
          return err as AxiosError
        }
        throw new Error(err)
      }
    }

    private async parseRolesFromXML(): Promise<STSAssumeRole[]> {
      this.document = et.parse(this.assertion)
      const roleText = this.document.findall('*/saml2:AttributeStatement/saml2:Attribute/saml2:AttributeValue')
      const roles: STSAssumeRole[] = []
      roleText.forEach(element => {
        const item = element.text as string
        if (item.includes('arn:aws:iam::')) {
          const data = item.split(',')
          roles.push({ principal: data[0], role: data[1]})
        }
      })
      return roles
    }

    private async parseAssertionFromHtml(): Promise<void> {
      let rawAssertion = ''
      const handler = new htmlparser.DefaultHandler(function(err: Error | null, dom: Node[]) {
        if (err) {
          console.error('Error: ' + err)
        } else {
          const samlObject = soup.select(dom, '#appForm')
          rawAssertion = samlObject[0].children[1].attribs.value
        }
      })
      const parser = new htmlparser.Parser(handler)
      parser.parseComplete(this.httpAssertion)

      // Strip out the HTML Hex Codes for + and = that appear in the saml
      this.b64Assertion = ExtAws.sanitizeSaml(rawAssertion)

      // Convert from Base64
      this.assertion = Buffer.from(this.b64Assertion, 'base64').toString('ascii')
      return
    }

    private static sanitizeSaml(assertion: string) {
      const regex = /&#x(\d+)[bd];/gi
      return assertion.replace(regex, function(match: string) {
        if (match === '&#x2b;') {
          return '+'
        }
        if(match === '&#x3d;') {
          return '='
        } else {
          throw 'Unknown match returned'
        }
      })
    }

    private async assumeRole(oktaRole: STSAssumeRole): Promise<STS.Types.AssumeRoleWithSAMLResponse> {
      const params = {
        PrincipalArn: oktaRole.principal,
        RoleArn: oktaRole.role,
        SAMLAssertion: this.b64Assertion,
        DurationSeconds: 3600,
      }
      return await this.sts.assumeRoleWithSAML(params).promise()
    }

    async setConfig(newConfig: Config): Promise<void> {
      const defaults = {
        saveCreds: true,
        defaultProfile: 'default',
        awsRegion: 'us-east-1',
      }
      let config = {
        ...defaults,
        oktaOrgName: newConfig.oktaOrgName,
        oktaSamlUrl: newConfig.oktaSamlUrl,
        saveCreds: newConfig.saveCreds,
      }
      if (newConfig.defaultProfile) {
        config = {
          ...config,
          defaultProfile: newConfig.defaultProfile,
        }
      }
      if (newConfig.awsRegion) {
        config = {
          ...config,
          awsRegion: newConfig.awsRegion
        }
      }
      await this.localSecrets('SET', 'extaws', 'config', config)
    }

    static async inquire<T>(questions: QuestionCollection): Promise<T> {
      return await prompt(questions) as T
    }
}

// async function main() {
// const extaws = new ExtAws()
// await extaws.clearCredentials()
//return await extaws.login()

// }
//
// main()





