var getPort = require('get-server-port')
var concat = require('concat-stream')
var FormData = require('form-data')
var http = require('http')
var path = require('path')
var pump = require('pump')
var spok = require('spok')
var tape = require('tape')
var fs = require('fs')

var multipart = require('./')

var filePath = path.join(__dirname, 'README.md')
var file = fs.readFileSync(filePath)

tape('should assert input types', function (assert) {
  assert.throws(multipart.bind(null), /object/)
  assert.throws(multipart.bind(null, {}), /function/)
  assert.throws(multipart.bind(null, {}, 123, function () {}), /object/)
  assert.end()
})

tape('should parse forms', function (assert) {
  assert.plan(11)

  var server = http.createServer(function (req, res) {
    assert.pass('request received')
    multipart(req, function (err, data) {
      assert.ifError(err, 'no error')
      spok(assert, data, {
        parts: [{
          filename: 'README.md',
          name: 'upload',
          encoding: '7bit',
          mimetype: 'text/x-markdown'
        }]
      })

      var stream = data.parts[0].stream
      assert.ok(stream, 'stream exists')
      pump(stream, concat(function (buf) {
        assert.equal(String(buf), String(file), 'file received')
        res.end()
      }))
    })
  })
  server.listen(function () {
    assert.pass('server listening')
  })

  var form = new FormData()
  var opts = {
    protocol: 'http:',
    hostname: 'localhost',
    port: getPort(server),
    path: filePath,
    headers: form.getHeaders(),
    method: 'POST'
  }

  form.append('upload', fs.createReadStream(filePath))
  pump(form, http.request(opts, function () {
    server.close()
  }))
})
