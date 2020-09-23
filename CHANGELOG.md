# ExtAws

This file is used to track notable changes to the codebase

## [Unreleased]

## [0.0.11] - 2020-09-23

### Added

- Support for OTP(Google Authenticator, Okta Verify) added

## [0.0.10] - 2020-09-21

### Added

- Now will use ora, or a passed in object to keep status for the login process

## [0.0.8] - 2020-09-17

### Added 

- Added the ability to pass a role to the login CLI command
- Improvements to the overall flow to setting config
- Writing credentials will now completely replace the profile section. This is to ensure that any extra keys that may exist are removed. Notable `aws_security_token`

## [0.0.7] - 2020-09-14

### Added

- This file
- Duration support across all functions

### Changed

- Changed code organization so index.js properly contains only exports 
- Updated promptForConfig() to accept all options as function parameters. It will also now ask only for items not passed in those parameters.
- Updated getConfig() to be static. Should have already been.
- login() now accepts profile, duration, region, and role as parameters. This allows for:
    - Completely headless calls when the user has multiple roles present in the SAML assertion
    - Setting a different profile than the default stored in config.

### Fixed

- Now properly sleeps when polling for MFA success
- Script will properly exit after the default 30 second timeout when polling for MFA sucess

<sup><sub>This files format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)</sub></sup>
