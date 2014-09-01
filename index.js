// dependencies
var extend      = require('util')._extend
  , async       = require('async')
  , download    = require('./libs/download.js')
  , run         = require('./libs/run.js')

// how to get all the remote libs and such
var remoteLibs = require('./libs/remoteLibs.js')

/**
  * Main entry point
  */
module.exports = function selenium(op, cb) {
  op = op || {}
  cb = typeof op === 'function' ? op : cb
  var platform = process.platform + '_' + process.config.variables.host_arch

  // create a local option hash overridden with the provided options
  var _op = extend({  port     : false                          // optional port
                    , selenium : remoteLibs.selenium            // selenium file/download info
                    , drivers  : remoteLibs.platform[platform]  // an array of drivers to download/user
                    , java     : []                             // additional java options
                    , log      : './selenium.log'               // a place to log what selenium is doing (filepath || stream)
                    , debugJava: false}                         // you want to see what options spawn('java') is getting?
                  , op)
  // download all files and then start the process
  async.each(_op.drivers.concat([_op.selenium])
                , download
                , function(e) {
                    if (e) return cb(e)
                    run(_op, cb)
                  })
}
