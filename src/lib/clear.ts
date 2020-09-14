#!/usr/bin/env node
import program from 'commander'
import { ExtAws } from './extaws'

program
  .option('-c --credentials', 'Print a link rather than open a browser session')
  .option('-f --config', 'Get a assume role link for target environment')
  .parse(process.argv)

async function clear(config: boolean, credentials: boolean) {
  await ExtAws.clearCredentials({ config, credentials })
    .catch(e => console.error(e))
}
clear(program.config, program.credentials)
