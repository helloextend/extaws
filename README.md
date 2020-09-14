# extaws

Typescript package that attempts to solve the problem of getting AWS CLI credentials when using Okta/AWS Saml integration.

It can be used as a CLI command or use the class methods to build additional functionality.

Configuration and credentials are stored using the [keytar](https://www.npmjs.com/package/keytar) package which abstracts Windows(Credential Vault)/Mac(Keychain)/Linux(libsecret) secret storage systems

###CLI

---

`extaws login` - Main command for logging in. Will prompt for config and user information if none is present

`extaws init` - Sets up the necessary configuration(Okta organization name, Okta SAML url, etc)

`extaws clear` - Clears local creds and/or configuration

###Direct implementation

---

Setting up configuration
```
const config = await ExtAws.promptForConfig()
await ExtAws.setConfig(config)
```

Logging in

```
const extaws = new ExtAws()
extaws.login()
``` 

Clearing configuration

```
const config = true
const credentials = true
await ExtAws.clearCredentials({ config, credentials })
```

### Example Execution

---

```shell script
$ extaws login 
? Okta Organization Name: whatsnew 
? Okta SAML Url:  app/amazon_aws/abcdef1234567/sso/saml
? Store Okta Credentials Yes
? AWS Profile to store credentials:  default
? AWS Region:  us-east-1
? Okta Username tom.jones@not-unusual.com
? Okta Password [hidden]
? Please select MFA factor ONEPLUS A6010
? Please select the role to assume super_admin 
```
