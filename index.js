var concat = require('concat-stream')

module.exports = function(handlerfunction, errorfn){
  return function(req, res){

    var args = Array.prototype.slice.call(arguments);
      
    req.pipe(concat(function(body){

      try {
        body = JSON.parse(body.toString())
      } catch (e){
        if(errorfn){

          var errorargs = [e.toString()].concat(args)
          errorfn.apply(null, errorargs)
        }
        else
        {
          res.statusCode = 500
          res.end(e.toString())
        }
        return
      }

      req.jsonBody = body

      handlerfunction.apply(null, args)
      
    }))
  }
}