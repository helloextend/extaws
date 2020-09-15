#!/usr/bin/env node
import { ExtAws } from './extaws'
import program from 'commander'

program
  .option('-p, --profile <profileName>', 'Name of the AWS Profile to use')
  .option('-d --duration <durationSeconds>', 'Print a link rather than open a browser session', '43200')
  .option('-r --region <awsRegion>', 'Region to set as default for the profile')
  .parse(process.argv)

async function login(profile?: string | undefined, duration?: number | undefined, region?: string | undefined) {
  const extaws = new ExtAws()
  extaws.login({profile, duration, region})
    .catch(e => console.error(e))
}

let duration: number | undefined
if (program.duration) {
  duration = parseInt(program.duration)
  if (isNaN(duration)) {
    console.error(`Provided duration is invalid: ${program.duration}`)
    process.exit(1)
  }
}

login(program.profile, duration, program.region)

