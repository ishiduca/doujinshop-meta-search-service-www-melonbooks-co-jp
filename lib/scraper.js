var missi = require('mississippi')
var trumpet = require('trumpet')

var WWW_MELONBOOKS_CO_JP = 'https://www.melonbooks.co.jp'

module.exports = function scraper () {
  var ws = trumpet()
  var rs = missi.through.obj()
  var selector = 'div[class="product clearfix"]>.relative'
  var c = 0
  var isEnded = false

  ws.selectAll(selector, function (aNode) {
    c += 1
    var tr = trumpet()
    var hash = {}
    tr.select('.thumb>a', function (link) {
      link.getAttribute('title', function (title) {
        hash.title = title
        link.getAttribute('href', function (href) {
          hash.urlOfTitle = WWW_MELONBOOKS_CO_JP + href
          tr.select('a>img', function (img) {
            img.getAttribute('data-src', function (_src) {
              hash.srcOfThumbnail = 'https:/' + _src.replace(/&amp;/g, '&').replace(/height=(\d+)/, 'height=450').replace(/width=(\d+)/, 'width=319')
              tr.select('div[class="group clearfix"]>.title>.circle>a', function (link) {
                link.getAttribute('title', function (circle) {
                  hash.circle = circle
                  link.getAttribute('href', function (href) {
                    hash.urlOfCircle = WWW_MELONBOOKS_CO_JP + href
                    rs.write(hash)
                    c -= 1
                    if (isEnded && c === 0) rs.end()
                  })
                })
              })
            })
          })
        })
      })
    })

    aNode.createReadStream().pipe(tr)
  })

  ws.once('end', function () {
    if (c === 0) rs.end()
    else (isEnded = true)
  })

  return missi.duplex.obj(ws, rs)
}
