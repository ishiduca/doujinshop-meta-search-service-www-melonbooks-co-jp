'use strict'
var test = require('tape')
var melonbooks = require('../index')
var fs = require('fs')
var path = require('path')
var iconv = require('iconv-lite')
var missi = require('mississippi')

test('var client = new Melonbooks', t => {
  var c = melonbooks()
  t.is(c.name, 'www.melonbooks.co.jp', 'c.name eq "www.melonbooks.co.jp"')
  t.is(c.failAfter, 7, 'c.failAfter === 7')
  t.is(c.searchHome, 'https://www.melonbooks.co.jp/search/search.php','c.search eq "https://www.melonbooks.co.jp/search/search.php"')
  t.end()
})

test('var qstr = client.createQuery(paarms)', t => {
  var c = melonbooks()
  var params = {
    category: 'mak',
    value: '床子屋'
  }
// https://www.melonbooks.co.jp/search/search.php
// mode=search
// search_disp=
// chara=
// orderby=
// disp_number=
// pageno=1
// text_type=circle
// name=%E5%BA%8A%E5%AD%90%E5%B1%8B
// is_end_of_sale%5B%5D=1
// is_end_of_sale2=1
// co_name=
// ci_name=
// sale_date_before=
// sale_date_after=
// publication_date_before=
// publication_date_after=
// price_low=0
// price_high=0
  t.test('var queryObj = client.transformQuery(params)', tt => {
    var o = c.transformQuery(params)
    t.deepEqual(o, {
      mode: 'search',
      search_disp: '',
      chara: '',
      orderby: 'date',
      disp_number: 200,
      pageno: 1,
      text_type: 'circle',
      name: '床子屋',
      'is_end_of_sale[]': 1,
      is_end_of_sale2: 1,
      'category_ids[]': 1,
      product_type: 'all'
    })
    tt.end()
  })

  var qs = c.createQuery(params)
  t.ok(/name=%E5%BA%8A%E5%AD%90%E5%B1%8B/.test(qs), qs)
  t.end()
})

test('var stream = client.scraper()', t => {
  var c = melonbooks()
  var b = []
  var a = [
    {title: 'ぼくの妹の処女買いませんか',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=219583',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001114806.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: '暗い家',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=218594',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001114282k.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'えりかのなつやすみ',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=137360',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001088955.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: '小夜子の食卓【再販分】',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=118145',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001081989.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'AFTER THE END',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=179526',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001102625.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: '超どたんばせとぎわ崖っぷち',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=21227',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001069667.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival 9 Anessa',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16857',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001058535.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve Evelyn',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16330',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001054284.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve OLWEN:2',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=15970',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001048713.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'エルフの女騎士の受難',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=151076',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001094399.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'どたんばせとぎわ崖っぷち30',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=31422',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001076650.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve Nest',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=31404',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001076632.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve Richildis:1&amp;2',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=23679',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001070773.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve Richildis:3',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=21226',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001069666.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival 10 Matty',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=19510',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001066493.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve 総集編',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=18086',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001065317.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'えれみか',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=17942',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001064701.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve Evelyn:2',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=17324',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001061332.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'ALI×MORU 2',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16884',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001058692.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve OLWEN:3',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16433',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001054936.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'ALI×MORU',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16329',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001054283.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival 8 Mabel',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16031',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001050544.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival 7 Mabel',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=16021',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001050385.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival 6 Mabel',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=15941',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001047271.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' },
    { title: 'Saint Foire Festival/eve OLWEN',
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=15896',
    srcOfThumbnail: 'https:///cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001045639.jpg&width=319&height=450&c=1&aa=0',
    circle: '床子屋',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=19745' }
  ]
  var i = 0

  missi.pipe(
    fs.createReadStream(path.join(__dirname, 'tokoya.html')),
    iconv.decodeStream(c.charset),
    c.scraper(),
    missi.through.obj((o, _, d) => {
      b.push(o)
      t.deepEqual(o, a[i])
      i += 1
      d()
    }),
    err => {
      t.notOk(err, 'no exits error')
      t.is(b.length, 25, 'b.length eq 25')
      t.end()
    }
  )
})
