var co = require('co')
var fs = require('mz/fs')
var path = require('path')

var MATCHER = new RegExp(''
  + '^'
  + '(.*?)'          // path
  + '(?:([A-Z]+):)?' // method
  + '([^/]*)'        // resource
  + '$'
)

module.exports = function (serveDir) {
  return {
    toRoute: function (filepath) {
      var match = MATCHER.exec(filepath.replace(serveDir, ''))
      return {
        method: match[2] || 'GET',
        path: path.join(match[1], match[3])
      }
    }
  }
}

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
