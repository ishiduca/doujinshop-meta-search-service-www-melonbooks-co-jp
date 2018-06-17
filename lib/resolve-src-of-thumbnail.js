const url = require('url')
const qs = require('querystring')
const xtend = require('xtend')

const Q = {
  width: 319,
  height: 450
}

module.exports = function srcOfThumbnail (_src) {
  const src = 'https://' + _src.replace(/^\/*/, '').replace(/&amp;/g, '&')
  const u = xtend(url.parse(src, true))
  const q = xtend(u.query, Q)
  delete q.c
  delete q.aa
  const uri = [u.protocol, '//', u.host, u.pathname].join('')
  return q.image == null ? uri : [uri, qs.stringify(q)].join('?')
}
