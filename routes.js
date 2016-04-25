var co = require('co')
var fs = require('mz/fs')
var path = require('path')

function * routeFiles (dir) {
  var ret = []
  var files = yield fs.readdir(dir)
  for (var file of files) {
    var fullpath = path.join(dir, file)
    var stat = yield fs.stat(fullpath)
    if (stat.isDirectory()) {
      var subRoutes = yield routeFiles(fullpath)
      ret.push.apply(ret, subRoutes)
    } else {
      ret.push(fullpath)
    }
  }
  return ret
}

function fromFile (serveDir, filepath) {
  var MATCHER = /^(.*?)(?:([A-Z]+):)?([^\/]*)$/
  var match = MATCHER.exec(filepath.replace(serveDir, ''))
  return {
    method: match[2] || 'GET',
    path: path.join(match[1], match[3])
  }
}

module.exports = co.wrap(function * routes (dir) {
  var files = yield routeFiles(dir)
  return files.map((file) => fromFile(dir, file))
})
