#!/usr/bin/env node
import { ExtAws } from './extaws'

async function login() {
  const extaws = new ExtAws()
  extaws.login()
    .catch(e => console.error(e))
}

login()

