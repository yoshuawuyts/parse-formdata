var content = require('content')
var assert = require('assert')
var xtend = require('xtend')
var pump = require('pump')
var pez = require('pez')

module.exports = parseFormdata

function parseFormdata (req, opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  var didError = false
  var state = {
    epilogue: [],
    preamble: [],
    fields: {},
    parts: []
  }

  assert.equal(typeof req, 'object', 'multipart-stream: req should be an object')
  assert.equal(typeof opts, 'object', 'multipart-stream: opts should be an object')
  assert.equal(typeof cb, 'function', 'multipart-stream: cb should be a function')

  opts = xtend(content.type(req.headers['content-type'] || ''), opts)
  var dispenser = new pez.Dispenser(opts)

  dispenser.on('preamble', function (preamble) {
    state.preamble.push(preamble)
  })

  dispenser.on('epilogue', function (epilogue) {
    state.epilogue.push(epilogue)
  })

  dispenser.on('error', function (err) {
    if (err) return sendErr(err)
  })

  dispenser.on('close', function () {
    if (!didError) cb(null, state)
  })

  dispenser.on('part', function (part) {
    var headers = part.headers
    var encoding = headers['content-transfer-encoding']
    encoding = encoding ? encoding.toLowerCase() : '7bit'

    state.parts.push({
      name: part.name,
      filename: part.filename,
      stream: part,
      headers: headers,
      encoding: encoding,
      mimetype: headers['content-type']
    })
  })

  dispenser.on('field', function (name, value) {
    state.fields[name] = value
  })

  pump(req, dispenser, function (err) {
    if (err) return sendErr(err)
  })

  function sendErr (err) {
    if (!didError) {
      didError = true
      cb(err)
    }
  }
}
