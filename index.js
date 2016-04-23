var path = require('path')
var fs = require('mz/fs')
var mime = require('mime-types')

function * exista () {
  var filepath = path.join.apply(null, arguments)
  if (yield fs.exists(filepath)) {
    return filepath
  }
}

function * resolve (basepath, request) {
  var methodPrefix = request.method === 'GET' ? '' : `${request.method}:`

  var dirname = path.join(basepath, path.dirname(request.path))
  var filename = path.basename(request.path)
  if (path.extname(filename)) {
    return yield exista(dirname, methodPrefix + filename)
  }

  return (yield exista(dirname, methodPrefix + `${filename}.json`)) ||
    (yield exista(dirname, filename, methodPrefix + 'index.json'))
}

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
  return function * () {
    var filepath = yield resolve(basepath, this.request)
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
