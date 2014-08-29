/**
  * Main entry point
  */
module.exports = function selenium(op, cb) {
  op = op || {}
  cb = typeof op === 'function' ? op : cb
  var platform = process.platform + '_' + process.config.variables.host_arch

  // create a local option hash overridden with the provided options
  var _op = extend({  port     : false                        // optional port
                    , selenium : remoteLibs.selenium.download // selenium file/download info
                    , drivers  : remoteLibs.platform[platform]// an array of drivers to download/user
                    , java     : []                           // additional java options
                    , log      : './selenium.log'             // a place to log what selenium is doing (filepath || stream)
                    , debugJava: false}                       // you want to see what options spawn('java') is getting?
                  , op)
  async.each(_op.drivers.concat([_op.selenium])
                , download
                , function(e) {
                    if (e) return cb(e)
                    run(_op, cb)
                  })
}

// implementation details

// dependencies
var fs          = require('fs')
  , path        = require('path')
  , request     = require('request')
  , hashFile    = require('hash_file')
  , spawn       = require('child_process').spawn
  , freeport    = require('freeport')
  , extend      = require('util')._extend
  , async       = require('async')
  , unzip       = require('unzip')

// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
var remoteLibs = {
        selenium: {
          version: '2.42.2'
        , download: {
            url: 'http://selenium-release.storage.googleapis.com/2.42/selenium-server-standalone-2.42.2.jar'
          , file: 'selenium-server-standalone-2.42.2.jar'
          , sha: '921005b6628821c9a29de6358917a82d1e3dfa94'}}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.9/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32.zip'
            , sha: '780c12bf34d4f4029b7586b927b1fa69'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.9/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64.zip'
            , sha: 'e2e44f064ecb69ec5b6f1b80f3d13c93'}
          ]
        , darwin_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.9/chromedriver_mac32.zip'
            , file: 'chromedriver_mac32'
            , sha: '27c4b663b8a46c5355cb62f85ee9ea01561d6e7a'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.9/chromedriver_win32.zip'
            , file: 'chromedriver_win32.zip'
            , sha: 'ef6a4819563ef993c3aac8f229c0ca91'}
          , { name: 'ie'
            , url: 'https://selenium.googlecode.com/files/IEDriverServer_Win32_2.39.0.zip'
            , file: 'IEDriverServer_Win32_2.39.0.zip'
            , sha: '71b8fad1dadc72a1b7e45ade3f5c3f72d4f02def'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'https://selenium.googlecode.com/files/IEDriverServer_x64_2.39.0.zip'
            , file: 'IEDriverServer_x64_2.39.0.zip'
            , sha: 'c7ffa258de34d0934120b269a5af76e14a62d2d4'}]}}

/**
  * The engine that will start the java selenium server
  */
function run(op, cb) {
  // no port? get one
  if (!op.port) {
    freeport(_run)
  } else {
    // run on the port give.  if it is taken, there will be an error....
    _run(null, op.port)
  }

  // helper function to deal with optional port
  function _run(e, port) {
    if (e) throw e

    var javaArgs = ['-jar', op.selenium.file, '-port', port]
    if (op.java) {
      javaArgs = javaArgs.concat(op.java)
    }
    if (op.drivers) {
      javaArgs = javaArgs.concat(op.drivers.map(function(i) {
        return '-Dwebdriver.'+i.name+'.driver='+i.file
      }))
    }
    console.log('Starting Selenium on port: ' + port)
    if (op.debugJava) {
      console.log('Starting java with args', javaArgs)
    }

    var child = spawn('java', javaArgs)
    // set some values on our return object
    child.host = '127.0.0.1'
    child.port = port

    // logs are good. use one
    if (op.log) {
      if (op.log instanceof require('stream').Stream) {
        var _log = op.log
      } else {
        var _log = fs.createWriteStream(op.log)
      }
      child.stdout.pipe(_log)
      child.stderr.pipe(_log)
    }

    // Pipe stderr over so that bad things are clear to the user
    child.stderr.pipe(process.stderr)

    // make sure we start up, just because the process is
    // started, does not mean the server is ready...
    // this is a quick and simple check
    child.stdout.on('data', function checkData(data) {
      var sentinal = 'Started org.openqa.jetty.jetty.Server'
      if (data.toString().indexOf(sentinal) != -1) {
        child.stdout.removeListener('data', checkData)
        // everything is good, send the process back with love
        cb(null, child)
      }
    })
  }
}

/**
  * Function to download and check a file
  * will unzip files by magic
  */
function download(op, cb) {
  op = op || {}
  cb = typeof op === 'function' ? op : cb

  // stat the file to make sure it's there...
  fs.stat(op.file, function(er, stat) {
    if (er) return real()
    // if we have a sha for the file, let's check it
    if (op.sha) {
      hashFile(op.file, 'sha1', function(er, sha) {
        if (er) return cb(er)
        if (sha != op.sha) {
          return _download(cb)
        } else {
          cb()
        }
      })
    } else {
      cb()
    }
  })

  /**
    * helper to do the real download if needed
    */
  function _download(cb) {
    console.log('Downloading:' + op.url)
    request({ url: op.url })
      .on('response', function(res) {
        res
          .on('data', function(chunk) {
            bar.tick(chunk.length)
          })
          .on('end', function() {
            cb() // deal with zip stream?
          })
        if (op.url.slice(-3).toLowerCase() === 'zip') {
          console.log('got zip')
          res
            .pipe(unzip.Parse())
            .on('entry', function(file) {
              file.pipe(fs.createWriteStream(op.file))
            })
        } else {
          res.pipe(fs.createWriteStream(op.file))
        }
      })
  }
}
