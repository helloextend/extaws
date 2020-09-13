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

export interface StateToken {
    stateToken: string
}

export interface  FactorType {
    id: string
    stateToken: string
}

export interface STSAssumeRole {
    principal: string
    role: string
}

export interface Config {
    oktaOrgName: string
    oktaUrl: string
    saveCreds: boolean
    defaultProfile: string
    awsRegion: string
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

export type OktaFactor = {
    id: string
    factorType: string
    provider: string
    vendorName: string
    profile: {
        [key: string]: any
    }
    _links: {
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
        [key:string]: any
    }
}

export interface OktaAuthResponse {
    stateToken?: string
    sessionToken?: string
    expiresAt?: string
    status: OktaAuthStatus
    _embedded?: OktaEmbedded
    _links?: any
}

export interface FactorInquire {
    factor: string
}

export interface OktaFactorAuthResponse extends OktaAuthResponse {
    factorResult: string
    challengeType: string
}
