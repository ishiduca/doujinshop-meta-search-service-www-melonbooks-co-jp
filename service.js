var xtend = require('xtend')
var trumpet = require('trumpet')
var inherits = require('inherits')
var urlencode = require('urlencode')
var { pipe, duplex, concat, through } = require('mississippi')
var Service = require('doujinshop-meta-search-service')

function ServiceWwwMelonbooksCoJp () {
  if (!(this instanceof ServiceWwwMelonbooksCoJp)) return new ServiceWwwMelonbooksCoJp()
  var { urlencode, backoff, hyperquest } = Service.defaultConfig
  var serviceHome = 'https://www.melonbooks.co.jp'
  var searchHome = `${serviceHome}/search/search.php`
  var config = {
    url: { serviceHome, searchHome },
    urlencode: xtend(urlencode),
    backoff: xtend(backoff),
    hyperquest: xtend(hyperquest)
  }
  Service.call(this, config)
}

inherits(ServiceWwwMelonbooksCoJp, Service)
module.exports = ServiceWwwMelonbooksCoJp

ServiceWwwMelonbooksCoJp.prototype.createURI = function createURI (params) {
  var { category, value, opts } = params
  var map = {
    mak: 'circle',
    act: 'author',
    nam: 'title',
    mch: 'chara',
    gnr: 'genre',
    kyw: 'tag',
    com: 'detail'
  }
  var query = xtend({
    mode: 'search',
    search_disp: '',
    chara: '',
    orderby: 'stock_asc', // 'date',
    disp_number: 200,
    pageno: 1,
    fromagee_flg: 2,
    search_target: 0,
    additional_all: 1,
    text_type: 'all',
    // search_target: 0,
    product_type: 'all',
    is_end_of_sale2: 1,
    'is_end_of_sale[]': 1
    // 'category_ids[]': 1,
  }, {
    text_type: map[category],
    name: value
  }, opts)

  return (
    this.config.url.searchHome + '?' +
      urlencode.stringify(query, this.config.urlencode)
  )
}

ServiceWwwMelonbooksCoJp.prototype.createOpts = function createOpts (params) {
  return xtend(
    this.config.hyperquest,
    { headers: xtend(this.config.hyperquest.headers) }
  )
}

ServiceWwwMelonbooksCoJp.prototype.scraper = function scraper () {
  var sink = trumpet()
  var source = through.obj()
  var isBingo = false
  var count = 0
  var { serviceHome } = this.config.url
  var p = new URL(serviceHome).protocol

  var resize = dataSrc => {
    var _ = `${p}${dataSrc}`
    var u = _.replace(/&amp;/g, '&')
    var uu = new URL(u)
    uu.searchParams.delete('c')
    uu.searchParams.delete('aa')
    uu.searchParams.set('width', 319)
    uu.searchParams.set('height', 450)
    return String(uu)
  }

  var onend = error => (error && source.emit('error', error))

  var selector = 'div[class^="product clearfix product_"]>.relative'
  sink.selectAll(selector, div => {
    isBingo = true
    count += 1

    var tr = trumpet()
    var mid = through.obj()

    tr.select('.thumb>a>img', img => {
      img.getAttribute('data-src', dataSrc => {
        mid.write({ thumbnail: { src: resize(dataSrc) } })
      })
    })

    tr.select('.group.clearfix>div.title', div => {
      var tr2 = trumpet()
      var links = []

      tr2.select('p.title a', a => {
        a.getAttribute('href', h => mid.write({ uri: `${serviceHome}${h}` }))
        pipe(
          a.createReadStream(),
          concat(b => mid.write({ title: String(b) })),
          onend
        )
      })

      tr2.selectAll('.author a,.circle a', a => {
        var lnk = {}
        a.getAttribute('href', h => (lnk.href = `${serviceHome}${h}`))
        pipe(
          a.createReadStream(),
          concat(b => (lnk.title = String(b))),
          error => {
            if (error) return source.emit('error', error)
            links.push(lnk)
          }
        )
      })

      pipe(div.createReadStream(), tr2, onend)
      tr2.once('end', () => mid.end({ links }))

      pipe(
        mid,
        concat(as => source.write(as.reduce((a, b) => xtend(a, b), {}))),
        error => {
          if (error) return source.emit('error', error)
          ;(count -= 1) || source.end()
        }
      )
    })

    pipe(div.createReadStream(), tr, onend)
  })

  sink.once('end', () => (isBingo || source.end()))
  return duplex.obj(sink, source)
}
