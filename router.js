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
    fetchAllRoutes: co.wrap(function * () {
      var files = yield this.fetchAllFiles()
      return files.map((file) => this.toRoute(file))
    }),

    toRoute: function (filepath) {
      var match = MATCHER.exec(filepath.replace(serveDir, ''))
      return {
        method: match[2] || 'GET',
        path: path.join(match[1], match[3])
      }
    },

    fetchAllFiles: co.wrap(function * (dir) {
      dir = dir || serveDir

      var files = yield fs.readdir(dir)
      var ret = []
      for (var file of files) {
        var fullpath = path.join(dir, file)
        var stat = yield fs.stat(fullpath)
        if (stat.isDirectory()) {
          var subFiles = yield allFiles(fullpath)
          ret.push.apply(ret, subFiles)
        } else {
          ret.push(fullpath)
        }
      }
      return ret
    }),
  }
}
