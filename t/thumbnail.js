'use strict'
const test = require('tape')
const thumb = require('../lib/resolve-src-of-thumbnail')

test('resolve srcOfThubmnail', t => {
  t.plan(1)
  const u = '//melonbooks.akamaized.net/user_data/packages/resize_image.php?image=212001156990.jpg&amp;width=225&amp;height=317&amp;c=1&amp;aa=0'
  const expectd = 'https://melonbooks.akamaized.net/user_data/packages/resize_image.php?image=212001156990.jpg&width=319&height=450'
  const uri = thumb(u)
  t.is(uri, expectd, uri)
})
