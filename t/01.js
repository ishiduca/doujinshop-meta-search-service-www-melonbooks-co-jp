'use strict'
const test = require('tape')
const melonbooks = require('../index')
const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const {pipe, through, concat} = require('mississippi')

test('const client = new Melonbooks', t => {
  const c = melonbooks()
  t.is(c.name, 'www.melonbooks.co.jp', 'c.name eq "www.melonbooks.co.jp"')
  t.is(c.failAfter, 7, 'c.failAfter === 7')
  t.is(c.searchHome, 'https://www.melonbooks.co.jp/search/search.php','c.search eq "https://www.melonbooks.co.jp/search/search.php"')
  t.end()
})

test('const qstr = client.createQuery(paarms)', t => {
  const c = melonbooks()
  const params = {
    category: 'mak',
    value: '床子屋'
  }

  t.test('const queryObj = client.transformQuery(params)', tt => {
    const o = c.transformQuery(params)
    t.deepEqual(o, {
      mode: 'search',
      search_disp: '',
      chara: '',
      orderby: 'date',
      disp_number: 200,
      pageno: 1,
      fromagee_flg: 2,
      text_type: 'circle',
      name: '床子屋',
      'is_end_of_sale[]': 1,
      is_end_of_sale2: 1,
      'category_ids[]': 1,
      product_type: 'all'
    })
    tt.end()
  })

  const qs = c.createQuery(params)
  t.ok(/name=%E5%BA%8A%E5%AD%90%E5%B1%8B/.test(qs), qs)
  t.end()
})

test('const stream = client.scraper()', t => {
  const c = melonbooks()
  const html = path.join(__dirname, 'zoal.html')
  const expected_0 = {
    title: 'プライベートビーチにて',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=374230',
    circle: 'ZOAL',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=9638',
    srcOfThumbnail: 'https://melonbooks.akamaized.net/user_data/packages/resize_image.php?image=212001159466.jpg&width=319&height=450'
  }
  const expected_7 = {
    title: 'LENAtic5',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=17357',
    circle: 'ZOAL',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=9638',
    srcOfThumbnail: 'https://melonbooks.akamaized.net/user_data/packages/resize_image.php?image=212001061492.jpg&width=319&height=450'
  }

  var buf = []

  pipe(
    fs.createReadStream(html),
    iconv.decodeStream(c.charset),
    c.scraper(),
    concat(res => (buf = res)),
    err => {
      t.error(err)
      t.is(buf.length, 8, 'length 8')
      t.deepEqual(buf[0], expected_0)
      t.deepEqual(buf[7], expected_7)
      t.end()
    }
  )
})
