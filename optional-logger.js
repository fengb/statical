module.exports =
  attempt(() => require('koa-logger')())
  || attempt(() => function * () { return yield })

function attempt (func) {
  try {
    return func()
  } catch (e) {}
}
