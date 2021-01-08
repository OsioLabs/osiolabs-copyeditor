#!/usr/bin/env node
'use strict'

/**
 * CLI utility to convert Markdown files to HTML.
 *
 * This uses remark + rehype. So you can use any remark or rehype plugins to
 * to the parsing and HTML output generation.
 * 
 * To configure plugins see .to-htmlrc.yml.
 * 
 * Example use:
 * ./to-html.js test.md
 * or
 * ./to-html.js directory/of/files/
 */
const start = require('unified-args')
const extensions = require('markdown-extensions')
const remark = require('remark')

const name = 'to-html'

start({
  processor: remark,
  name: name,
  description: 'Convert Markdown to HTML',
  version: '0.0.1',
  pluginPrefix: name,
  extensions: extensions,
  packageField: name + 'Config',
  rcName: '.' + name + 'rc',
  ignoreName: '.' + name + 'ignore'
});
