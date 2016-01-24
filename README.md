# json-request-handler

A function to accept a JSON request http body.

```
var jsonRequest = require('json-request-handler')

var handler = jsonRequest(function(req, res){

  // req.jsonBody is populated with the processed body
  var prop = req.jsonBody.prop

}, function(err, req, res){

  // if you define this function it means don't automatically
  // handle errors and return the error here instead
  res.end(err.toString())

})

var server = http.createServer(handler)

server.listen(80)
```

## install

```bash
$ npm install json-request-handler
```

## test

```bash
$ npm test
```

## API

#### `jsonRequest(fn, errorfn)`

You pass a handler function that will be called once the HTTP request body has been processed.  The handler function is called with the same arguments as it would have been - for example:

```js
var handler = jsonRequest(function(req, res, opts, cb){

  // opts and cb are arguments populated by whatever router you are using

})
```


## error handler

If there is an error processing the JSON body - a statusCode `500` will be written and the error written as the response body.

Setting the `errorfn` function means the automatic error handling is disabled and the error (along with the other arguments) is passed in.

var handler = jsonRequest(function(req, res, opts, cb){
}, function(err, req, res, opts, cb){
  // here we handle the error manually
})

## Licence

MIT
