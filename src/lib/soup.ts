// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { DomUtils } from 'htmlparser2'

const tagRe = /^[a-z0-9]+$/

/*
 /^(\w+)?\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/
   \---/  \---/\-------------/    \-------/
     |      |         |               |
     |      |         |           The value
     |      |    ~,|,^,$,* or =
     |   Attribute
    Tag
*/
const attrSelectRe = /^(\w+)?\[(\w+)([=~|^$*]?)=?"?([^\]"]*)"?\]$/

/**
 Takes an operator and a value and returns a function which can be used to
 test other values against test provided value using the given operation
 Used to checking attribute values for attribute selectors
 */
function makeValueChecker(operator, value) {
  value = typeof(value) === 'string' ? value : ''

  return operator ? {
    '=': function ( test_value ) { return test_value === value },
    // attribute includes value as one of a set of space separated tokens
    '~': function ( test_value ) { return test_value ? test_value.split(/\s+/).indexOf(value) !== -1 : false },
    // attribute starts with value
    '^': function ( test_value ) { return test_value ? test_value.substr(0, value.length) === value : false },
    // attribute ends with value
    '$': function ( test_value ) { return test_value ? test_value.substr(-value.length) === value : false },
    // attribute contains value
    '*': function ( test_value ) { return test_value ? test_value.indexOf(value) !== -1 : false },
    // attribute is either exactly value or starts with value-
    '|': function ( test_value ) { return test_value ? test_value === value ||
            test_value.substr(0, value.length + 1) === value + '-' : false },
    // default to just check attribute existence...
  }[operator] : function ( test_value ) { return test_value ? true : false }

}

/**
 Takes a dom tree or part of one from htmlparser and applies
 the provided selector against. The returned value is also
 a valid dom tree, so can be passed by into
 htmlparser.DomUtil.* calls
 */
export const select = function(dom, selector) {
  let currentContext = [dom]
  let found, tag, options

  const tokens = selector.split(/\s+/)

  for ( let i = 0; i < tokens.length; i++ ) {

    // Attribute selectors
    const match = attrSelectRe.exec(tokens[i])
    if ( match ) {
      const attribute = match[2], operator = match[3], value = match[4]
      tag = match[1]
      options = {}
      options[attribute] = makeValueChecker(operator, value)

      found = []
      for (let j = 0; j < currentContext.length; j++ ) {
        found = found.concat(DomUtils.getElements(options, currentContext[j], false))
      }

      if ( tag ) {
        // Filter to only those matching the tag name
        found = DomUtils.getElements({ 'tag_name': tag }, found, false)
      }

      currentContext = found

    }

    // ID selector
    else if ( tokens[i].indexOf('#') !== -1 ) {
      found = []

      const id_selector = tokens[i].split('#', 2)[1]

      // need to stop on the first id found (in bad HTML)...
      let el = null
      for ( let k = 0; k < currentContext.length; k++ ) {

        // the document has no child elements but tags do so we search children to avoid
        // returning the current element via a false positive
        if ( typeof currentContext[k].children !== 'undefined' ) {
          el = DomUtils.getElementById(id_selector, currentContext[k].children)
        } else {
          el = DomUtils.getElementById(id_selector, currentContext[k])
        }

        if ( el ) {
          found.push(el)
          break
        }
      }

      if (!found[0]) {
        currentContext = []
        break
      }

      currentContext = found
    }

    // Class selector
    else if ( tokens[i].indexOf('.') !== -1 ) {
      const parts = tokens[i].split('.')
      tag = parts[0]
      options = {}
      options['class'] = function (value) {
        if (!value) return false
        const classes = value.split(/\s+/)
        for (let i = 1, len = parts.length; i < len; i++) {
          if (!~classes.indexOf(parts[i])) return false
        }
        return true
      }

      found = []
      for ( let l = 0; l < currentContext.length; l++ ) {
        let context = currentContext[l]
        if ( tag.length > 0 ) {
          context = DomUtils.getElementsByTagName(tag, context, true)
          // don't recurse in the case we have a tag or we get children we might not want
          found = found.concat(DomUtils.getElements(options, context, false))
        } else {
          found = found.concat(DomUtils.getElements(options, context, true))
        }

      }

      currentContext = found
    }

    // Star selector
    else if ( tokens[i] === '*' ) {
      // nothing to do right?
    }

    // Tag selector
    else {
      if (!tagRe.test(tokens[i])) {
        currentContext = []
        break
      }

      found = []
      for ( let m = 0; m < currentContext.length; m++ ) {
        // htmlparsers document itself has no child property - only nodes do...
        if ( typeof currentContext[m].children !== 'undefined' ) {
          found = found.concat(DomUtils.getElementsByTagName(tokens[i], currentContext[m].children, true))
        } else if (i === 0) {
          found = found.concat(DomUtils.getElementsByTagName(tokens[i], currentContext[m], true))
        }

      }

      currentContext = found
    }
  }

  return currentContext
}
