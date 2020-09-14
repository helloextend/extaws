import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs'
import { parse } from 'ini'
import {homedir} from 'os'
import { exec } from 'shelljs'
import {STS} from 'aws-sdk'

export const forwardSlashRegEx = /^([^/])/i

export const USER_HOME_DIR = homedir()
export const AWS_BASE = `${USER_HOME_DIR}/.aws`
export const AWS_CONFIG_FILE = `${AWS_BASE}/config`
export const AWS_CREDS_FILE = `${AWS_BASE}/credentials`

export async function sleep(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const parseAWSIni = (path: string): unknown => {
  // Ensure that the .aws directory exists
  if (!existsSync(AWS_BASE)) {
    mkdirSync(AWS_BASE)
  }
  // Ensure that the credentials file will exist for future use
  if (!existsSync(AWS_CREDS_FILE)) {
    writeFileSync(AWS_CREDS_FILE, '', { encoding: 'utf-8', flag: 'wx'})
  }
  if (!existsSync(AWS_CONFIG_FILE)) {
    writeFileSync(AWS_CONFIG_FILE, '', { encoding: 'utf-8', flag: 'wx'})
  }
  let iniObject = {}
  try {
    iniObject = parse(readFileSync(path, {encoding: 'utf-8', flag: 'a+'}))
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw new Error(err)
    }
  }
  return iniObject
}

export const writeAwsProfile = async (
  profile: string,
  region: string,
  creds: STS.Types.Credentials,
): Promise<void> => {
  exec(`
      aws configure set aws_access_key_id ${creds.AccessKeyId} --profile ${profile}
      `)
  exec(`
      aws configure set aws_secret_access_key ${creds.SecretAccessKey} --profile ${profile}
      `)
  exec(`aws configure set aws_session_token ${creds.SessionToken} --profile ${profile}`)
  exec(`aws configure set region ${region} --profile ${profile}`)
}
