#!/usr/bin/env node
'use strict'
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    category: 'mak'
  },
  alias: {
    c: 'category'
    h: 'help'
  }
})

if (argv.help) {
  help()
  process.exit(0)
}


var missi = require('mississippi')
var melonbooks = require('../index')
var req = melonbooks().createStream()

req.on('error', err => console.error(err))
req.pipe(missi.through.obj((d, _, done) => {
  done(null, JSON.stringify(d))
})).pipe(process.stdout, {end: false})

req.end({
  category: argv.category,
  value: argv._.filter(Boolean).join(' ')
})


function help () {
  console.log(`
usage: > metasearch --category=mak MTSP
  `)
}
