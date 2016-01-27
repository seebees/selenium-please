module.exports = download

var fs       = require('fs')
  , request  = require('request')
  , hashFile = require('hash_file')
  , unzip    = require('unzip')
  , lockFile = require('lockfile')

/**
  * Function to download and check a file
  * will unzip files by magic
  */
function download(op, cb) {
  op = op || {}
  cb = typeof op === 'function' ? op : (cb || function noop(){})

  // stat the file to make sure it's there...
  fs.stat(op.file, function(er, stat) {
    if (er && !lockFile.checkSync(op.file + '.lock')) {
      try {
        lockFile.lockSync(op.file + '.lock')
        return _download(function(_er) {
            lockFile.unlockSync(op.file + '.lock')
            if(_er) return cb(_er)
            checkSha(op, cb)
          })
      } catch (ex) {
        // assuming that the error is EEXIST from lockFile.lockSync
      }
    }
    // if we have a file let's check it
    var tries = 0;
    lockFile.check(op.file + '.lock'
      , {wait: 2000}
      , function checkLock(e, isLocked) {
          if(e) return cb(e)
          if(isLocked) {
            if (tries < (op.tries || 4)) {
              lockFile.check(op.file + '.lock', {wait: 2000}, checkLock)
            } else {
              cb(new Error('file still locked'))
            }
          } else {
            checkSha(op, cb)
          }
      })
  })

  /**
    * helper to do the real download if needed
    */
  function _download(cb) {
    console.log('Downloading:' + op.url)
    request({ url: op.url })
      .on('response', function(res) {
        if (op.url.slice(-3).toLowerCase() === 'zip') {
          res
            .pipe(unzip.Parse())
            .on('entry', function(file) {
              file.pipe(fs.createWriteStream(op.file, {mode: 0777}))
                .on('finish', cb)
            })
        } else {
          res.pipe(fs.createWriteStream(op.file, {mode: 0777}))
            .on('finish', cb)
        }
      })
  }

  function checkSha(op, cb) {
    // if we have a sha for the file, let's check it
    if (op.sha) {
      hashFile(op.file, 'sha1', function(er, sha) {
        if (er) return cb(er)
        if (sha != op.sha) {
          cb(new Error('sha1:' + sha + ' does not match expected sha1:' + op.sha))
        } else {
          cb()
        }
      })
    } else {
      cb()
    }
  }
}