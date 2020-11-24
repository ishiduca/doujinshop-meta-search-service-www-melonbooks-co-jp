var Service = require('../service')
var s = Service()
var category = 'act'
var value = '池咲ミサ'
var hook = f => g => (e, d) => e ? f(e) : g(d)
var h = hook(e => console.error(e))

s.makeRequest({ category, value }, h(r => r.pipe(process.stdout, { end: false })))
