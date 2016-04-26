var expect = require('chai').expect
var router = require('../router')

describe('router', function () {
  beforeEach(function () {
    this.router = router('target')
  })

  describe('toRoute()', function () {
    it ('"target/index.html" => "GET /index.html"', function () {
      var route = this.router.toRoute('target/index.html')
      expect(route).to.deep.equal({
        method: 'GET',
        path: '/index.html'
      })
    })

    it ('"target/POST:index.json" => "POST /index.json"', function () {
      var route = this.router.toRoute('target/POST:index.json')
      expect(route).to.deep.equal({
        method: 'POST',
        path: '/index.json'
      })
    })

    it ('"target/nested/PUT:index.json" => "PUT /nested/index.json"', function () {
      var route = this.router.toRoute('target/nested/PUT:index.json')
      expect(route).to.deep.equal({
        method: 'PUT',
        path: '/nested/index.json'
      })
    })
  })
})
