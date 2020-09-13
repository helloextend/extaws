#!/usr/bin/env node
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios'
import {CookieJar} from 'tough-cookie'
// import { WriteFileSync } from 'fs'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import * as htmlparser from 'htmlparser2'
import {Node} from 'domhandler'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as soup from 'soupselect'
import {STS} from 'aws-sdk'
import * as et from 'elementtree'
import {sleep, writeAwsProfile} from './lib/util'
import {
    Config,
    Credentials,
    FactorInquire,
    FactorType,
    OktaAuth,
    OktaAuthResponse,
    OktaFactor,
    STSAssumeRole,
} from './lib/types'
import {prompt} from 'inquirer'
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
    oktaOrg: string

    constructor() {
        this.assertion = ''
        this.httpAssertion = ''
        this.b64Assertion = ''
        this.document = {} as et.ElementTree
        this.rawAssertion = ''
        this.sts = new STS()
        this.sessionToken = ''
        this.oktaOrg = ''
        this.client = {} as AxiosInstance
    }

    /**
     * Generate a unique string to service as a device token for Okta logins
     * @returns 32 character string
     */
    generateDeviceToken(): string {
        return [...Array(32)].map(()=>(~~(Math.random()*36)).toString(36)).join('')
    }

    /**
     * Prompts the user to select a MFA token from the provided array
     * @param factors - List of factors provided in Okta authentication response
     *
     * @returns Okta ID of the selected factor
     */
    private static async selectToken(factors: OktaFactor[]): Promise<string> {
        if (factors.length === 1) return factors[0].id
        const factorList = factors.map( factor => {
            const name = factor.profile.name || factor.factorType
            return { name, value: factor.id}
        })
        const { factor }: FactorInquire = await prompt([{
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
    private async handleMFA(authResponse: OktaAuthResponse): Promise<void | never> {
        if (authResponse._embedded && authResponse._embedded.factors && authResponse.stateToken) {
            const factor = await ExtAws.selectToken(authResponse._embedded.factors)

            let counter = 0
            let verify: OktaAuthResponse | AxiosError
            do {
                verify = await this.verifyFactor({ id: factor, stateToken: authResponse.stateToken})
                if (!('status' in verify)) {
                    throw new Error(verify.message)
                }
                counter++
                await sleep(1000)
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
            throw new Error('Unable to find factors in auth reponse')
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
        const { role } = await prompt([{
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
    private async getCredentials(): Promise<Credentials> {
        const savedCreds = await keytar.getPassword('extaws', 'okta')
        let credentials: Credentials
        if (!savedCreds) {
            const { username, password }: Credentials = await prompt([{
                name: 'username',
                type: 'input',
                message: 'Okta Username',
            },
            {
                name: 'password',
                type: 'password',
                message: 'Okta Password'
            }])
            const deviceToken = this.generateDeviceToken()
            credentials = { username, password, deviceToken }
        } else {
            credentials = JSON.parse(savedCreds)
            if (!credentials.deviceToken) {
                credentials.deviceToken = this.generateDeviceToken()
            }
        }
        return credentials
    }

    /**
     * Stores the user credentials
     * @param credentials - username, password, and device token
     */
    private static async setCredentials(credentials: Credentials): Promise<void> {
        await keytar.setPassword('extaws', 'okta', JSON.stringify(credentials))
        return
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
            const { oktaOrgName, oktaUrl, saveCreds, defaultProfile, awsRegion } = await prompt([
                {
                    name: 'oktaOrgName',
                    type: 'input',
                    message: 'Okta Organization Name',
                },
                {
                    name: 'oktaUrl',
                    type: 'input',
                    message: 'Okta SAML Url: ',
                },
                {
                    name: 'saveCreds',
                    type: 'confirm',
                    message: 'Store Okta Credentials'
                },
                {
                    name: 'defaultProfile',
                    type: 'input',
                    message: 'AWS Profile to store credentials: ',
                    default: 'default',
                },
                {
                    name: 'awsRegion',
                    type: 'input',
                    message: 'AWS Region: ',
                    default: 'us-east-1'
                }
            ])
            config = { oktaOrgName, oktaUrl, saveCreds, defaultProfile, awsRegion }
            await this.setConfig(oktaOrgName, oktaUrl, saveCreds, defaultProfile, awsRegion)
        } else {
            config = JSON.parse(storedConfig)
        }
        return config
    }

    /**
     * Main method for logging a user into AWS via Okta. Will log a user in and write credentials to aws profile
     * @returns AWS Credentials
     */
    async login(): Promise<STS.Types.AssumeRoleWithSAMLResponse> {
        const config = await this.getConfig()

        this.client = axios.create({
            withCredentials: true,
            baseURL: `https://${config.oktaOrgName}.okta.com`,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        axiosCookieJarSupport(this.client)
        this.client.defaults.jar = new CookieJar()
        const credentials = await this.getCredentials()
        const authResponse = await this.oktaLogin(credentials)
        if (!('status' in authResponse)) throw new Error(authResponse.message)

        await ExtAws.setCredentials(credentials)
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
        await this.getSamlHtml(config.oktaUrl)
        await this.parseAssertionFromHtml()
        const roles = this.parseRolesFromXML()
        const userRole = await ExtAws.selectRole(roles)
        const creds = await this.assumeRole(userRole)
        await writeAwsProfile(config.defaultProfile, config.awsRegion, creds.Credentials)
        return creds
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
    private async verifyFactor(factor: FactorType): Promise<OktaAuthResponse | AxiosError> {
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
                    redirectUrl: 'https://extend.okta.com/app/amazon_aws/exk2al8ytXmIK7EsN4x6/sso/saml'
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

    private parseRolesFromXML(): STSAssumeRole[] {
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

    async setConfig(oktaOrgName: string, oktaUrl: string, saveCreds: boolean, defaultProfile?: string, awsRegion?: string): Promise<void> {
        const defaults = {
            saveCreds: true,
            defaultProfile: 'default',
            awsRegion: 'us-east-1',
        }
        let config = {
            ...defaults,
            oktaOrgName,
            oktaUrl,
            saveCreds,
        }
        if (defaultProfile) {
            config = {
                ...config,
                defaultProfile
            }
        }
        if (awsRegion) {
            config = {
                ...config,
                awsRegion
            }
        }
        await keytar.setPassword('extaws', 'config', JSON.stringify(config))
    }
}

async function main() {
    const extaws = new ExtAws()
    // await extaws.clearCredentials()
    return await extaws.login()
}

main()
//     // @ts-ignore
//     let verify = await extaws.verifyFactor({ factorId: login['_embedded'].factors[0].id, stateToken: login.stateToken})
//     while(verify.status !== 'SUCCESS') {
//         // @ts-ignore
//         verify = await extaws.verifyFactor({ factorId: login['_embedded'].factors[0].id, stateToken: login.stateToken})
//         await sleep(1000)
//     }
//     const sessionToken = verify.sessionToken
//     await extaws.getSessionCookie(sessionToken)
//     await extaws.getSamlPage()
//     await extaws.getRawAssertion()
//
//     extaws.parseXML()
//
//     const roleText = extaws.document.findall('*/saml2:AttributeStatement/saml2:Attribute/saml2:AttributeValue')
//     let roles: OktaRole[] = []
//     roleText.forEach(element => {
//         const item = element.text as string
//         if (item.includes('arn:aws:iam::')) {
//             const data = item.split(',')
//             roles.push({ principal: data[0], role: data[1]})
//         }
//     })
//     console.log(roles)
//     const sts = new STS()
//     const params = {
//         PrincipalArn: roles[0].principal,
//         RoleArn: roles[0].role,
//         SAMLAssertion: extaws.b64Assertion,
//         DurationSeconds: 3600,
//     }
//     const creds = await sts.assumeRoleWithSAML(params).promise()
//     console.log(creds)
// }
//
// main()
