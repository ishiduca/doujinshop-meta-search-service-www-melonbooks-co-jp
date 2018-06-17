const {through, duplex} = require('mississippi')
const trumpet = require('trumpet')
const resolveSrcOfThumbnail = require('./resolve-src-of-thumbnail')

const WWW_MELONBOOKS_CO_JP = 'https://www.melonbooks.co.jp'

module.exports = function scraper () {
  const ws = trumpet()
  const rs = through.obj()
  const selector = 'div[class="product clearfix"]>.relative'
  var c = 0
  var isEnded = false

  ws.selectAll(selector, (aNode) => {
    c += 1
    const tr = trumpet()
    const hash = {}
    tr.select('.thumb>a', (link) => {
      link.getAttribute('title', (title) => {
        hash.title = title
        link.getAttribute('href', (href) => {
          hash.urlOfTitle = WWW_MELONBOOKS_CO_JP + href
          tr.select('a>img', (img) => {
            img.getAttribute('data-src', (_src) => {
              hash.srcOfThumbnail = resolveSrcOfThumbnail(_src)
              tr.select('div[class="group clearfix"]>.title>.circle>a', (link) => {
                link.getAttribute('title', (circle) => {
                  hash.circle = circle
                  link.getAttribute('href', (href) => {
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

  ws.once('end', () => {
    if (c === 0) rs.end()
    else (isEnded = true)
  })

  return duplex.obj(ws, rs)
}
