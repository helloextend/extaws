export interface Credentials {
    username: string
    password: string
    deviceToken?: string
}

export interface OktaAuth {
    username: string
    password: string
    context?: {
        deviceToken: string
    }
}

export interface  FactorType {
    id: string
    stateToken: string
}

export interface STSAssumeRole {
    principal: string
    role: string
}

export interface ExtAwsUserConfig {
  defaultProfile: string
  duration: number
  awsRegion: string
  extaws: {
    oktaOrgName: string
    oktaSamlUrl: string
    saveCreds: boolean
  }
}

export type FactorDevice = 'token:software:totp' | 'push' | 'sms'

export type FactorSelect = {
    factor: string,
    type: FactorDevice,
}

// https://developer.okta.com/docs/reference/api/authn/#transaction-state
type OktaAuthStatus =
    | 'LOCKED_OUT'
    | 'MFA_ENROLL_ACTIVATE'
    | 'MFA_ENROLL'
    | 'PASSWORD_EXPIRED'
    | 'PASSWORD_RESET'
    | 'PASSWORD_WARN'
    | 'RECOVERY_CHALLENGE'
    | 'RECOVERY'
    | 'MFA_REQUIRED'
    | 'MFA_CHALLENGE'
    | 'SUCCESS'

export const CONFIG_PROMPT = [
  {
    name: 'oktaOrgName',
    type: 'input',
    message: 'Okta Organization Name:',
  },
  {
    name: 'oktaSamlUrl',
    type: 'input',
    message: 'Okta SAML Url:',
  },
  {
    name: 'saveCreds',
    type: 'confirm',
    message: 'Store Okta Credentials'
  },
  {
    name: 'defaultProfile',
    type: 'input',
    message: 'AWS Profile to store credentials:',
    default: 'default',
  },
  {
    name: 'duration',
    type: 'number',
    message: 'Default credential duration (in seconds):',
    default: 43200,
  },
  {
    name: 'awsRegion',
    type: 'input',
    message: 'AWS Region:',
    default: 'us-east-1'
  }
]

export const USER_PASS_PROMPT = [{
  name: 'username',
  type: 'input',
  message: 'Okta Username:',
},
{
  name: 'password',
  type: 'password',
  message: 'Okta Password:'
}]


export type OktaFactor = {
    id: string
    factorType: string
    provider: string
    vendorName: string
    profile: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any
    }
    _links: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any
    }
}

interface OktaUserProfile {
    firstName: string
    lastName: string
    locale?: string
    login: string
    timeZone?: string
}

// https://developer.okta.com/docs/reference/api/authn/#embedded-resources
interface OktaEmbedded {
    user?: {
        id: string
        passwordChanged: string
        profile: OktaUserProfile
        recovery_question?: {
            question: string
        }
    }
    factor?: OktaFactor
    factors?: OktaFactor[]
    policy?: {
        allowRememberDevice: boolean
        rememberDeviceByDefault: boolean
        rememberDeviceLifetimeInMinutes: number
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key:string]: any
    }
}

export interface OktaAuthResponse {
    stateToken?: string
    sessionToken?: string
    expiresAt?: string
    status: OktaAuthStatus
    _embedded?: OktaEmbedded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _links?: any
}

export interface FactorInquire {
    factor: string
}
