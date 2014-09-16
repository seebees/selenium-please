// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'http://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.1.jar'
        , file: 'selenium-server-standalone-2.43.1.jar'
        , sha: 'ef1b5f8ae9c99332f99ba8794988a1d5b974d27b'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: 'a124ba4a477bf369360c868deaa6e88cebfe4ea1'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: '37ac75d5a81e89ade946c4eb0b3e4c0692c58080'}
          ]
        , darwin_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_mac32.zip'
            , file: 'chromedriver_mac32'
            , sha: '7f68abbaac01edb8342b5d027833488e708d0fa1'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_win32.zip'
            , file: 'chromedriver_win32'
            , sha: 'da25f16562029df24881724fbac381b51e45d71d'}
          , { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.43/IEDriverServer_Win32_2.43.0.zip'
            , file: 'IEDriverServer_Win32_2.43.0.exe'
            , sha: 'e0683671828360b3de15b7b8fde3cfe2b0498540'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.43/IEDriverServer_x64_2.43.0.zip'
            , file: 'IEDriverServer_x64_2.43.0.exe'
            , sha: '2a790031c41ba0daa42436200210cd94458c4879'}]}
      , listHash: function() {
          // just a way to download everything and output the sha to update versions and such
          // in a simple node REPL
          // require('./remoteLibs.js').listHash()
          var to_get = []
          for (p in module.exports.platform) {
            to_get = to_get.concat(module.exports.platform[p])
          }
          to_get.push(module.exports.selenium)

          var async = require('async')
          async
            .each(to_get
                , require('./download.js')
                , function(e) {
                    if (e) {
                      console.log(e)
                      return
                    }
                    async
                      .each(to_get
                          , function(op, cb) {
                              require('hash_file')(op.file, 'sha1', function(er, sha) {
                                if (er) return cb(er)
                                console.log([op.file, sha])
                                })
                          })
                })
      }}