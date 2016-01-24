var concat = require('concat-stream')

module.exports = function(handlerfunction, errorfn){
  return function(req, res, opts, cb){
      
    req.pipe(concat(function(body){

      try {
        body = JSON.parse(body.toString())
      } catch (e){
        if(errorfn){
          errorfn(e)
        }
        else
        {
          res.statusCode = 500
          res.end(e.toString())
        }
        return
      }

      req.jsonBody = body

      handlerfunction(req, res)
      
    }))
  }
}