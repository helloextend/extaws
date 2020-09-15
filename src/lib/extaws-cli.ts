import program from 'commander'

program
  .version('0.0.1')
  .name('extaws')
  .command('init', 'Initialize an AWS with necessary information for this tool', {executableFile: 'init'})
  .command('login [username] [password]', 'Login to AWS Hub account via Okta', {isDefault: true, executableFile: 'login'})
  .command('clear', 'Clear locally stores information', {executableFile: 'clear'})
  .parse(process.argv)
