#!/usr/bin/env node
'use strict'

var main = require('unified-args')
var remark = require('remark')

const name = 'osiolabs-lint';

main({
  processor: remark,
  name: name,
  description: 'Linter for Osio Labs tutorial content.',
  version: '1.0.0',
  pluginPrefix: 'remark',
  extensions: ['md', 'markdown'],
  packageField: `${name}-config`,
  rcName: `.${name}rc.yml`,
  ignoreName: `.${name}ignore`,
});
