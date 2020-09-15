# ExtAws

This file is used to track notable changes to the codebase

## [Unreleased]

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
