var tape = require('tape')
var async = require('async')
var jsonRequest = require('./index')
var http = require('http')
var from = require('from2-string')
var hyperquest = require('hyperquest')
var concat = require('concat-stream')

tape('processes a JSON body', function (t) {

  var testServer = null
  var collectedJSON = null
  var collectedRes = null
  var testJSON = {
    fruit:'apples',
    height:10
  }
  var testJSONString = JSON.stringify(testJSON)

  async.series([

    function(next){

      var handler = jsonRequest(function(req, res){

        collectedJSON = req.jsonBody
        res.end('ok')

      })

      testServer = http.createServer(handler)

      testServer.listen(8089, next)
    },

    function(next){
      setTimeout(next, 100)
    },

    function(next){

      
      var req = hyperquest('http://127.0.0.1:8089', {
        method:'POST'
      })

      from(testJSONString).pipe(req).pipe(concat(function(data){

        t.equal(data.toString(), 'ok')
        t.deepEqual(testJSON, collectedJSON)
        collectedRes = data
        next()
      }))
    },

    function(next){
      testServer.close(next)
    }

  ], function(err){
    if(err){
      t.error(err)
      t.end()
      return
    }
    t.end()
  })
})


tape('handles an error via response', function (t) {

  var testServer = null
  var collectedJSON = null
  var collectedRes = null
  var testJSONString = '{"fruit":"apples", "val":45 8}'

  async.series([

    function(next){

      var handler = jsonRequest(function(req, res){

        collectedJSON = req.jsonBody
        res.end('ok')

      })

      testServer = http.createServer(handler)

      testServer.listen(8089, next)
    },

    function(next){
      setTimeout(next, 100)
    },

    function(next){

      
      var req = hyperquest('http://127.0.0.1:8089', {
        method:'POST'
      })

      req.on('response', function(res){
        t.equal(res.statusCode, 500)
      })

      from(testJSONString).pipe(req).pipe(concat(function(data){

        t.equal(data.toString(), 'SyntaxError: Unexpected number')
        
        next()
      }))
    },

    function(next){
      testServer.close(next)
    }

  ], function(err){
    if(err){
      t.error(err)
      t.end()
      return
    }
    t.end()
  })
})
