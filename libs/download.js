module.exports = download

var fs       = require('fs')
  , request  = require('request')
  , hashFile = require('hash_file')
  , unzip    = require('unzip')

/**
  * Function to download and check a file
  * will unzip files by magic
  */
function download(op, cb) {
  op = op || {}
  cb = typeof op === 'function' ? op : cb

  // stat the file to make sure it's there...
  fs.stat(op.file, function(er, stat) {
    if (er) return _download(cb)
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
          .on('end', function() {
            cb() // deal with zip stream?
          })
        if (op.url.slice(-3).toLowerCase() === 'zip') {
          res
            .pipe(unzip.Parse())
            .on('entry', function(file) {
              file.pipe(fs.createWriteStream(op.file, {mode: 0777}))
            })
        } else {
          res.pipe(fs.createWriteStream(op.file))
        }
      })
  }
}