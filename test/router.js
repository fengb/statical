var expect = require('chai').expect
var co = require('co')
var router = require('../router')

describe('router', function () {
  beforeEach(function () {
    this.router = router('example')
  })

  describe('fetchFilepath()', function () {
    it('"GET /index.json" => "example/index.json"', co.wrap(function * () {
      var filepath = yield this.router.fetchFilepath({
        method: 'GET',
        path: '/index.json',
      })
      expect(filepath).to.equal('example/index.json')
    }))

    it('"POST /index.json" => "example/POST:index.json"', co.wrap(function * () {
      var filepath = yield this.router.fetchFilepath({
        method: 'POST',
        path: '/index.json',
      })
      expect(filepath).to.equal('example/POST:index.json')
    }))

    it('"POST /missing.json" => undefined', co.wrap(function * () {
      var filepath = yield this.router.fetchFilepath({
        method: 'POST',
        path: '/missing.json',
      })
      expect(filepath).to.equal(undefined)
    }))

    it('"GET /" => "example/index.json"', co.wrap(function * () {
      var filepath = yield this.router.fetchFilepath({
        method: 'GET',
        path: '/',
      })
      expect(filepath).to.equal('example/index.json')
    }))

    it('"POST /nested" => "example/nested/POST:index.json"', co.wrap(function * () {
      var filepath = yield this.router.fetchFilepath({
        method: 'POST',
        path: '/nested',
      })
      expect(filepath).to.equal('example/nested/POST:index.json')
    }))

    it('"POST /flattened" => "example/POST:flattened.json"', co.wrap(function * () {
      var filepath = yield this.router.fetchFilepath({
        method: 'POST',
        path: '/flattened',
      })
      expect(filepath).to.equal('example/POST:flattened.json')
    }))
  })

  describe('toRoute()', function () {
    it('"example/index.html" => "GET /index.html"', function () {
      var route = this.router.toRoute('example/index.html')
      expect(route).to.deep.equal({
        method: 'GET',
        path: '/index.html'
      })
    })

    it('"example/POST:index.json" => "POST /index.json"', function () {
      var route = this.router.toRoute('example/POST:index.json')
      expect(route).to.deep.equal({
        method: 'POST',
        path: '/index.json'
      })
    })

    it('"example/nested/PUT:index.json" => "PUT /nested/index.json"', function () {
      var route = this.router.toRoute('example/nested/PUT:index.json')
      expect(route).to.deep.equal({
        method: 'PUT',
        path: '/nested/index.json'
      })
    })
  })
})
