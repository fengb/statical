var path = require('path')
var fs = require('mz/fs')
var mime = require('mime-types')
var router = require('./router')

function parseHeaders (headersRaw) {
  var headers = []
  for (var headerLine of headersRaw.split('\n')) {
    var split = headerLine.split(/: */)
    var field = split[0]
    var value = split[1]
    if (field.toLowerCase() === 'status') {
      headers.status = Number(value)
    } else if (field) {
      headers[field] = value
    }
  }
  return headers
}

module.exports = function (basepath) {
  var routeur = router(basepath)
  return function * () {
    var filepath = yield routeur.fetchFilepath(this.request)
    if (!filepath) {
      this.status = 404
      this.body = 'Not found'
      return
    }

    this.type = mime.contentType(path.basename(filepath))
    var contents = yield fs.readFile(filepath, 'utf8')

    if (contents.indexOf('===---===') === -1) {
      this.body = contents
      return
    }

    var split = contents.split('===---===')
    var headers = parseHeaders(split[0])
    if (headers.status) {
      this.status = headers.status
      delete headers.status
    }
    this.set(headers)
    this.body = split[1]
  }
}
