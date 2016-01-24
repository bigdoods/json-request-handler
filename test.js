var tape = require('tape')
var async = require('async')
var jsonRequest = require('./index')
var http = require('http')
var from = require('from2-string')
var hyperquest = require('hyperquest')
var hyperrequest = require('hyperrequest');
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
        res.setHeader('Content-type', 'text/plain')
        res.end('ok')

      })

      testServer = http.createServer(handler)

      testServer.listen(8089, next)
    },

    function(next){
      setTimeout(next, 100)
    },

    function(next){


      hyperrequest({
        url:'http://127.0.0.1:8089',
        method: 'POST',
        headers:{
          "Content-type": "application/json"
        },
        json: testJSON
      }, function(err, res){
        t.equal(res.body, 'ok')
        t.deepEqual(testJSON, collectedJSON)
        next()
        
      })
      
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


tape('handle additional arguments', function (t) {

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

      var handler = jsonRequest(function(req, res, extra1, extra2){

        res.end(extra1 + ',' + extra2)

      })

      testServer = http.createServer(function(req, res){
        handler(req, res, 'apples', 'oranges')
      })

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

        t.equal(data.toString(), 'apples,oranges')
        
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

tape('handles an error via response', function (t) {

  var testServer = null
  var collectedJSON = null
  var collectedRes = null
  var testJSONString = '{"fruit":"apples", "val":45 8}'

  async.series([

    function(next){

      var handler = jsonRequest(function(req, res){
        t.error('the handler should not be called')
        res.end('fail')
      }, function(err, req, res){
        res.statusCode = 500
        res.end(err + ' = the error')
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

        t.equal(data.toString(), 'SyntaxError: Unexpected number = the error')
        
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
