import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios'
import {CookieJar} from 'tough-cookie'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import * as htmlparser from 'htmlparser2'
import {STS} from 'aws-sdk'
import * as et from 'elementtree'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Package has no types
import * as soup from 'soupselect'
import {sleep, writeAwsProfile, forwardSlashRegEx } from './util'
import {
  Config,
  Credentials,
  FactorInquire,
  FactorType,
  OktaAuth,
  OktaAuthResponse,
  OktaFactor,
  STSAssumeRole,
  USER_PASS_PROMPT
} from './types'
import {prompt, QuestionCollection} from 'inquirer'
import * as keytar from 'keytar'

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
        console.log('Polling for MFA success')
        do {
          verify = await this.verifyFactor({ id: factor, stateToken: authResponse.stateToken})
          if (!('status' in verify)) {
            throw new Error(verify.message)
          }
          if (verify.status !== 'SUCCESS') await sleep(1000)
          if (counter > 30) {
            console.log('Timing out after thirty seconds')
            console.log(`Auth State: ${verify.status}`)
            process.exit(1)
          }
          counter++
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
      const { role } = await ExtAws.inquire<{role: number}>([{
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
      const savedCreds = await ExtAws.localSecrets('GET', 'extaws', 'okta')
      let credentials = null
      if (!savedCreds) {
        const { username, password } = await ExtAws.inquire<Credentials>(USER_PASS_PROMPT)
        const deviceToken = this.generateDeviceToken(32)
        credentials = { username, password, deviceToken }
      } else {
        if (('username' in (savedCreds as any))) {
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
    static async clearCredentials(options?: { config?: boolean, credentials?: boolean}): Promise<boolean> {
      if (options?.credentials) {
        ExtAws.localSecrets('DELETE', 'extaws', 'okta')
        console.log('Credentials cleared')
      }
      if (options?.config) {
        ExtAws.localSecrets('DELETE','extaws', 'config')
        console.log('Configuration cleared')
      }
      return true
    }

    /**
    * Handles prompting the user for necessary configuration information and returns it
     * @returns Config
    */
    static async promptForConfig(
      inputOktaOrgName?: string,
      inputOktaSamlUrl?: string,
      inputSaveCreds?: boolean,
      inputDefaultProfile?: string,
      inputDuration?: number,
      inputAwsRegion?: string
    ): Promise<Config> {
      let oktaOrgName: string
      if (!inputOktaOrgName) {
        const { promptOktaOrgName } = await ExtAws.inquire({
          name: 'promptOktaOrgName',
          type: 'input',
          message: 'Okta Organization Name:',
        })
        oktaOrgName = promptOktaOrgName
      } else {
        oktaOrgName = inputOktaOrgName
      }

      let oktaSamlUrl: string
      if (!inputOktaSamlUrl) {
        const { promptOktaSamlUrl } = await ExtAws.inquire({
          name: 'promptOktaSamlUrl',
          type: 'input',
          message: 'Okta SAML Url:',
        })
        oktaSamlUrl = promptOktaSamlUrl
      } else {
        oktaSamlUrl = inputOktaSamlUrl
      }

      let saveCreds: boolean
      if (!inputSaveCreds) {
        const { promptSaveCreds } = await ExtAws.inquire({
          name: 'promptSaveCreds',
          type: 'confirm',
          message: 'Store Okta Credentials'
        })
        saveCreds = promptSaveCreds
      } else {
        saveCreds = inputSaveCreds
      }

      let defaultProfile: string
      if (!inputDefaultProfile) {
        const { promptDefaultProfile } = await ExtAws.inquire({
          name: 'promptDefaultProfile',
          type: 'input',
          message: 'AWS Profile to store credentials:',
          default: 'default',
        })
        defaultProfile = promptDefaultProfile
      } else {
        defaultProfile = inputDefaultProfile
      }

      let duration: number
      if (!inputDuration) {
        const { promptDuration } = await ExtAws.inquire({
          name: 'promptDuration',
          type: 'number',
          message: 'Default credential duration (in seconds):',
          default: 43200,
        })
        duration = promptDuration
      } else {
        duration = inputDuration
      }

      let awsRegion: string
      if (!inputAwsRegion) {
        const { promptAwsRegion } = await ExtAws.inquire({
          name: 'promptAwsRegion',
          type: 'input',
          message: 'AWS Region:',
          default: 'us-east-1'
        })
        awsRegion = promptAwsRegion
      } else {
        awsRegion = inputAwsRegion
      }

      if(oktaSamlUrl.match(forwardSlashRegEx)) {
        oktaSamlUrl = `/${oktaSamlUrl}`
      }

      return {
        oktaOrgName,
        oktaSamlUrl,
        saveCreds,
        defaultProfile,
        duration,
        awsRegion
      }
    }

    /**
     * This loads the stored configuration, if any, and prompts the user if not found.
     * It will then attempt to store the data for future use
     * @returns Object with configuration for Okta and user details
     */
    static async getConfig(): Promise<Config | null> {
      const storedConfig = await keytar.getPassword('extaws', 'config')
      let config: Config
      if (!storedConfig) {
        return null
      } else {
        config = JSON.parse(storedConfig)
      }
      return config
    }

    /**
    * Creates and configures the Axios client. Also attaches the necessary coookie jar for session management
    */
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
    async login(props?: { profile?: string, duration?: number, region?: string, role?: string }): Promise<STS.Types.AssumeRoleWithSAMLResponse> {
      const configResult = await ExtAws.getConfig()
      if (configResult === null ) {
        this.config = await ExtAws.promptForConfig()
        await ExtAws.setConfig(this.config)
      } else {
        this.config = configResult
      }

      const awsRoleDuration = ( props?.duration || this.config.duration ) || 43200
      const awsProfile = ( props?.profile || this.config.defaultProfile ) || 'default'
      const awsRegion = ( props?.region || this.config.awsRegion ) || 'us-east-1'

      this.createAxiosClient()

      const credentials = await this.getCredentials()
      if (!credentials) throw new Error('Error retrieving stored credentials')

      const authResponse = await this.oktaLogin(credentials)
      if (!('status' in authResponse)) throw new Error(`Error during login: ${authResponse.message}`)

      if (this.config.saveCreds) await ExtAws.localSecrets('SET', 'extaws', 'okta', credentials)

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

      let userRole: STSAssumeRole
      if (props?.role)  {
        const needle = props.role // TODO - Fix this. Compiler was being weird about props.role being undefined in the filter
        const searchResult = roles.filter(stsRole => {
          return (~stsRole.role.indexOf(needle))
        })[0]
        if (searchResult !== undefined) {
          userRole = searchResult
        } else {
          console.log(`Provided role(${props.role}) was not found. Please select from roles found`)
          userRole = await ExtAws.selectRole(roles)
        }
      } else {
        userRole = await ExtAws.selectRole(roles)
      }

      const creds = await this.assumeRole(userRole, awsRoleDuration)
      if (!creds.Credentials) throw new Error('Error during role assumption')
      await writeAwsProfile(awsProfile, awsRegion, creds.Credentials)
      return creds
    }

    /**
     * This function serves as a wrapper around the keytar package and its associated methods
     * @param operation - The type of operation to be performed
     * @param service - The name of the service
     * @param account - Account for the service entry
     * @param data - The data to store in the secret
     *
     * @returns Typed data or the appropriate response from the different methods
     */
    static async localSecrets<T>(operation: 'GET' | 'SET' | 'DELETE', service: string, account: string, data?: T): Promise<boolean | void | null | string | T> {
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
     *
     * @returns Auth response object from Okta or the error during the request
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

    /**
     * This calls the Okta endpoint that sets a session cookie based on the provided token
     */
    private async getSessionCookie(): Promise<AxiosResponse | AxiosError> {
      try {
        return await this.client.get('/login/sessionCookieRedirect', {
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

    /**
     * This loads the Okta provided SAML endpoint that would normally log the user into the AWS console
     * @param samlUrl
     *
     * @returns Response from the call or the error encountered
     */
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

    /**
     * Parses the XML assertion for roles available to the user
     *
     * @returns Array of roles found in the XML
     */
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

    /**
     * This parses out the base64 encoded assertion out of the raw HTML returned from the SAML endpoint
     * It decodes the assertion and removes any HTML Hex unicode values found in it
     */
    private async parseAssertionFromHtml(): Promise<void> {
      let rawAssertion = ''
      const handler = new htmlparser.DefaultHandler(function(err: Error | null, dom: unknown) {
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

    /**
     * Removes HTML Hex Unicode characters found in the b64 encoded assertion.
     * Currently removes + and =
     * @param assertion
     *
     * @returns String with replaced characters
     */
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

    /**
     * Assumes the AWS role with the SAML assertion
     * @param role - Principal and target role ARN
     * @param duration - Optional duration for credentials expiration
     *
     * @returns AWS Credentials
     */
    private async assumeRole(role: STSAssumeRole, duration?: number): Promise<STS.Types.AssumeRoleWithSAMLResponse> {
      return await this.sts.assumeRoleWithSAML({
        PrincipalArn: role.principal,
        RoleArn: role.role,
        SAMLAssertion: this.b64Assertion,
        DurationSeconds: duration || 43200,
      }).promise()
    }

    /**
     * Sets the config based on defaults and values provided
     * @param newConfig
     */
    static async setConfig(newConfig: Config): Promise<void> {
      const defaults = {
        saveCreds: true,
        defaultProfile: 'default',
        awsRegion: 'us-east-1',
        duration: 43200,
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
      if (newConfig.duration) {
        config = {
          ...config,
          duration: newConfig.duration
        }
      }
      await this.localSecrets('SET', 'extaws', 'config', config)
    }

    /**
     * Function to handle invoking user prompts
     * @param questions
     *
     * @returns Typed user response(s)
     */
    static async inquire<T>(questions: QuestionCollection): Promise<T> {
      return await prompt(questions) as T
    }
}
