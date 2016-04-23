module.exports =
  attempt(() => require('koa-logger')())
  || attempt(() => function * (next) { yield next })

function attempt (func) {
  try {
    return func()
  } catch (e) {}
}
