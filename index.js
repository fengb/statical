var path = require('path')
var fs = require('mz/fs')
var mime = require('mime-types')

function potentialFiles (basepath, request) {
  var dirname = path.join(basepath, path.dirname(request.path))
  var filename = path.basename(request.path)
  var methodPrefix = request.method === 'GET' ? '' : `${request.method}:`
  if (path.extname(filename) === '') {
    return [
      path.join(dirname, methodPrefix + `${filename}.json`),
      path.join(dirname, filename, methodPrefix + 'index.json')
    ]
  } else {
    return [path.join(dirname, methodPrefix + filename)]
  }
}

function processContents (response, contents) {
  if (contents.indexOf('===---===') !== -1) {
    var splitContents = contents.split('===---===')
    contents = splitContents[1]
    var headers = splitContents[0]
    for (var headerLine of headers.split('\n')) {
      var splitLine = headerLine.split(/: */)
      var field = splitLine[0]
      var value = splitLine[1]
      if (field.toLowerCase() === 'status') {
        response.status = Number(value)
      } else if (field) {
        response.set(field, value)
      }
    }
  }
  response.body = contents
  return response
}

module.exports = function (basepath) {
  return function * () {
    for (var fullpath of potentialFiles(basepath, this.request)) {
      var exists = yield fs.exists(fullpath)
      if (exists) {
        this.type = mime.contentType(path.basename(fullpath))
        var contents = yield fs.readFile(fullpath, 'utf8')
        return processContents(this, contents)
      }
    }

    this.status = 404
    this.body = 'Not found'
  }
}
