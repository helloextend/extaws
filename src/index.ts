#!/usr/bin/env node
import program from 'commander'

program
  .version('0.0.1')
  .name('extaws')
  .command('init', 'Initialize an AWS with necessary information for this tool', {executableFile: 'lib/init'})
  .command('login [username] [password]', 'Login to AWS Hub account via Okta', {isDefault: true, executableFile: 'lib/login'})
  .command('clear', 'Clear locally stores information', {executableFile: 'lib/clear'})
  .parse(process.argv)

