var xtend = require('xtend')
var inherits = require('inherits')
var Service = require('doujinshop-meta-search-service')

module.exports = Melonbooks
inherits(Melonbooks, Service)

function Melonbooks () {
  if (!(this instanceof Melonbooks)) return new Melonbooks()
  Service.call(this, 'www.melonbooks.co.jp', {
    charset: 'utf8',
    searchHome: 'https://www.melonbooks.co.jp/search/search.php'
  })
}

Melonbooks.prototype.transformQuery = function (_p) {
  var c = {
    mak: 'circle',
    act: 'author',
    nam: 'title',
    gnr: 'genre',
    mch: 'chara',
    com: 'detail',
    // ser: 'all',
    kyw: 'tag'
  }
  var p = xtend(_p)
  var q = {
    text_type: (c[p.category] || 'all'),
    name: p.value
  }

  delete p.category
  delete p.value

  return xtend({
    mode: 'search',
    search_disp: '',
    chara: '',
    orderby: 'date', // ["date":新着順,"popular":人気順,"price_desc":価格の高い
    //                  順,"price_asc":価格の安い順]
    disp_number: 200,
    pageno: 1,
    fromagee_flg: 2, // 0: melonbooks, 1: Fromagee, 2: 両方
    // search_target: 0, // 0: すべての商品, 1: 通常の商品, 2: 電子書籍のみ
    text_type: 'all', // ["all":全て,"title":作品タイトル,"detail":作品詳細,"circle":サークル,"maker":メーカー
    //                   "author":作家名,"genre":ジャンル名,"chara":キャラ名,"tag":タグ名,"event":イベント]
    //                   name: '', // 検索キーワード必須
    product_type: 'all', // ["all":全商品,"st":発売中,"sa":予約受け付け中,"ty":
    //                       お取り寄せ]
    'is_end_of_sale[]': 1, // 売り切れ作品を表示
    is_end_of_sale2: 1, // 売り切れ作品を表示
    'category_ids[]': 1 // アイテム[1:同人誌,2:同人ソフト,3:同人グッズ,4:コミッ
    //                     クス,5:ゲーム,6:音楽,17:映像
    //                     7:商業グッズ,8:自社グッズ]
    // "additional[]": '' // オプション絞込["pr":特典付き作品,"mn":専売作品,"r18":R18,"r15":R15,"common":一般]
  }, q, p)
}

Melonbooks.prototype.scraper = require('./lib/scraper')
