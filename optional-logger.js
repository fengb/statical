module.exports =
  attempt(() => require('koa-logger')())
  || function * (next) {
       yield next
       console.log(`  ${this.request.method} ${this.request.path} ${this.status}`)
     }

function attempt (func) {
  try {
    return func()
  } catch (e) {}
}
