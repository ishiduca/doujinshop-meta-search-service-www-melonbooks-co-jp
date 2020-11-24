var test = require('tape')
var fs = require('fs')
var url = require('url')
var path = require('path')
var { pipe, concat } = require('mississippi')
var Service = require('./service')

test('', t => {
  t.plan(1)
  t.ok(Service)
})

test('var instance = new Constructor()', t => {
  t.test('client = new Service()', t => {
    t.plan(1)
    t.ok((new Service()) instanceof Service)
  })
  t.test('client = Service()', t => {
    t.plan(1)
    t.ok((Service()) instanceof Service)
  })
  t.end()
})

test('client.config = { urlencode, url, backoff, hyperquest }', t => {
  var s = new Service()
  t.test('urlencode has a "charset" prop', t => {
    t.plan(1)
    var charset = 'utf8'
    t.is(s.config.urlencode.charset, charset, 'charset "utf8"')
  })
  t.test('url has "serviceHome", "searchHome" props', t => {
    t.plan(2)
    var serviceHome = 'https://www.melonbooks.co.jp'
    var searchHome = 'https://www.melonbooks.co.jp/search/search.php'
    t.is(s.config.url.serviceHome, serviceHome, `serviceHome "${serviceHome}"`)
    t.is(s.config.url.searchHome, searchHome, `searchHome "${searchHome}"`)
  })
  t.test('backoff has a "failAfter" prop', t => {
    t.plan(1)
    var failAfter = 10
    t.is(s.config.backoff.failAfter, failAfter, `failAfter "${failAfter}"`)
  })
  t.test('hyperquest has "method", "headers" props', t => {
    t.plan(2)
    var method = 'GET'
    var userAgent = 'hyperquest/2.13'
    var headers = { 'user-agent': userAgent }
    t.is(s.config.hyperquest.method, method, `method "${method}"`)
    t.deepEqual(s.config.hyperquest.headers, headers, `headers "${JSON.stringify(headers)}"`)
  })
  t.end()
})

test('requestURI = client.createURI({ category, value, opts = {} })', t => {
  var s = new Service()
  t.test('category "mak"', t => {
    var category = 'mak'
    var value = 'もすきーと音'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=circle&name=%E3%82%82%E3%81%99%E3%81%8D%E3%83%BC%E3%81%A8%E9%9F%B3&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale[]=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.is(expected.protocol, result.protocol, `protocol "${result.protocol}"`)
    t.is(expected.host, result.host, `host "${result.host}"`)
    t.is(expected.hostname, result.hostname, `hostname "${result.hostname}"`)
    t.is(expected.port, result.port, `port "${result.port}"`)
    t.is(expected.pathname, result.pathname, `pathname "${result.pathname}"`)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.test('category "nam"', t => {
    var category = 'nam'
    var value = '娼年'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=title&name=%E5%A8%BC%E5%B9%B4&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale%5B%5D=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.test('category "act"', t => {
    var category = 'act'
    var value = 'ぐれーともす'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=author&name=%E3%81%90%E3%82%8C%E3%83%BC%E3%81%A8%E3%82%82%E3%81%99&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale%5B%5D=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.test('category "mch"', t => {
    var category = 'mch'
    var value = '直葉'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=chara&name=%E7%9B%B4%E8%91%89&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale%5B%5D=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.test('category "gnr"', t => {
    var category = 'gnr'
    var value = 'げんしけん'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=genre&name=%E3%81%92%E3%82%93%E3%81%97%E3%81%91%E3%82%93&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale%5B%5D=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.test('category "kyw"', t => {
    var category = 'kyw'
    var value = 'ホモ'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=tag&name=%E3%83%9B%E3%83%A2&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale%5B%5D=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.test('category "com"', t => {
    var category = 'com'
    var value = 'メス堕ち'
    var params = { category, value }
    var _expected = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&chara=&orderby=stock_asc&disp_number=200&pageno=1&text_type=detail&name=%E3%83%A1%E3%82%B9%E5%A0%95%E3%81%A1&fromagee_flg=2&search_target=0&additional_all=1&product_type=all&is_end_of_sale%5B%5D=1&is_end_of_sale2=1'
    var expected = url.parse(_expected, true)
    var _result = s.createURI(params)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `query "${JSON.stringify(result.query)}"`)
    t.end()
  })
  t.end()
})

test('requestOpts = client.createOpts({ category, value, opts = {} })', t => {
  var s = new Service()
  var category = 'mak'
  var value = 'dummy'
  var params = { category, value }
  var requestOpts = s.createOpts(params)
  var expected = {
    method: 'GET',
    headers: { 'user-agent': 'hyperquest/2.13' }
  }
  t.deepEqual(requestOpts, expected, `requestOpts "${JSON.stringify(requestOpts)}"`)
  t.end()
})

test('duplexStream = client.scraper()', t => {
  var s = new Service()
  var html = path.join(__dirname, 'data/result.html')
  var expected = 24
  pipe(
    fs.createReadStream(html),
    s.scraper(),
    concat(results => {
      t.is(results.length, expected, `${results.length}`)
    }),
    error => {
      t.error(error, 'no error')
      t.end()
    }
  )
})
