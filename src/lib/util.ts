import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs'
import { parse, encode } from 'ini'
import {homedir} from 'os'
import type { Credentials } from '@aws-sdk/client-sts'

export const forwardSlashRegEx = /^([^/])/i

export const USER_HOME_DIR = homedir()
export const AWS_BASE = `${USER_HOME_DIR}/.aws`
export const AWS_CONFIG_FILE = `${AWS_BASE}/config`
export const AWS_CREDS_FILE = `${AWS_BASE}/credentials`

export async function sleep(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export type AwsIni = { [key: string]: any }
export type AwsCredsAndConfig = { configIni: AwsIni, credsIni: AwsIni }

export const parseAWSIni = (): AwsCredsAndConfig => {
  // Ensure that the .aws directory exists
  if (!existsSync(AWS_BASE)) {
    mkdirSync(AWS_BASE)
  }
  // Ensure that the credentials file will exist for future use
  if (!existsSync(`${AWS_BASE}/.aws`)) {
    writeFileSync(`${AWS_BASE}/.aws`, '', { encoding: 'utf-8', flag: 'wx'})
  }
  if (!existsSync(`${AWS_CONFIG_FILE}`)) {
    writeFileSync(`${AWS_CONFIG_FILE}`, '', { encoding: 'utf-8', flag: 'wx'})
  }

  if (!existsSync(`${AWS_CREDS_FILE}`)) {
    writeFileSync(`${AWS_CREDS_FILE}`, '', { encoding: 'utf-8', flag: 'wx'})
  }

  let configIni = {}
  let credsIni = {}
  try {
    configIni = parse(readFileSync(AWS_CONFIG_FILE, {encoding: 'utf-8', flag: 'a+'}))
    credsIni = parse(readFileSync(AWS_CREDS_FILE, {encoding: 'utf-8', flag: 'a+'}))
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw new Error(err)
    }
  }
  return { configIni, credsIni }
}

export const profileIniFormatter = (
  profile: string | undefined
): string => {
  if (profile === undefined) { profile = 'default' }
  return (profile === 'default') ? 'default' : `profile ${profile}`
}


export const writeAwsConfig = (
  profile?: string,
  region?: string,
  config?: AwsIni
): void => {
  let initData: AwsIni
  if (!config) {
    const { configIni } = parseAWSIni()
    initData = configIni

    const awsConfigProfile = profileIniFormatter(profile)

    if (!(awsConfigProfile in initData)) {
      initData[awsConfigProfile] = { region }
    } else {
      initData[awsConfigProfile].region = region
    }
  } else {
    initData = config
  }

  writeFileSync(AWS_CONFIG_FILE, encode(initData), { encoding: 'utf-8', flag: 'w'})
}

export const writeAwsCredentials = (
  profile: string,
  creds: Credentials,
): void => {
  const { credsIni } = parseAWSIni()
  credsIni[profile] = {
    aws_access_key_id: creds.AccessKeyId,
    aws_secret_access_key: creds.SecretAccessKey,
    aws_session_token: creds.SessionToken,
  }
  writeFileSync(AWS_CREDS_FILE, encode(credsIni), { encoding: 'utf-8', flag: 'w'})
}
