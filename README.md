# parse-formdata
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Parse formdata in Node.

## Usage

```js
var parseFormdata = require('parse-formdata')
var http = require('http')

http.createServer(function (req, res) {
  parseFormdata(req, function (err, data) {
    if (err) throw err
    console.log('fields:', data.fields)
    data.parts.forEach(function (part) {
      console.log('part:', part.fieldname)
    })
    res.end('Be kind to each other')
  })
}).listen(8080)
```

## API
### `parseFormdata(req, cb(err, data))`
Parse formdata from an HTTP request. `data` has the following fields:
- __fields:__ key-value data from fields
- __parts:__ an array of streams for the multipart file uploads
- __preamble:__ an array of data from the `preamble` event
- __epilogue:__ an array of data from the `epilogue` event

## See Also
- [yoshuawuyts/validate-formdata](https://github.com/yoshuawuyts/validate-formdata/)
- [yoshuawuyts/multipart-read-stream](https://github.com/yoshuawuyts/multipart-read-stream)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/parse-formdata.svg?style=flat-square
[3]: https://npmjs.org/package/parse-formdata
[4]: https://img.shields.io/travis/yoshuawuyts/parse-formdata/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/parse-formdata
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/parse-formdata/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/parse-formdata
[8]: http://img.shields.io/npm/dm/parse-formdata.svg?style=flat-square
[9]: https://npmjs.org/package/parse-formdata
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
