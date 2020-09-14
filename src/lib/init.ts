#!/usr/bin/env node
import program from 'commander'
import { ExtAws } from './extaws'

program
  .option('-p, --profile <profileName>', 'Name of the AWS Profile to use')
  .option('-l --link', 'Print a link rather than open a browser session')
  .option('-e --environment <envName>', 'Get a assume role link for target environment')
  .parse(process.argv)

async function init() {
  const userConfig = await ExtAws.promptForConfig()
  await ExtAws.setConfig(userConfig)
    .catch(e => console.error(e))
}

init()
