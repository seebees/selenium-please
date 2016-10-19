// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'http://selenium-release.storage.googleapis.com/3.0/selenium-server-standalone-3.0.1.jar'
        , file: 'selenium-server-standalone-3.0.1.jar'
        , sha: '121fbf5e2ab406fd80e8dd6a51a4e018a397b8f9'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.24/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: '759099cc6df3ce2fc16e17ff42d112fcb9200ffd'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-linux32.tar.gz'
            , file: 'geckodriver-v0.11.1_linux32'
            , sha: '269a27304313ac5669f5c3acab5c7a273088892d'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.24/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: 'a6d5985804e63faba52d0a3a26c518f09a10c1b0'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-linux64.tar.gz'
            , file: 'geckodriver-v0.11.1_linux64'
            , sha: 'de46bc91105506c681a7d8c97c0f71583b8446a7'}
          ]
        , darwin: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.24/chromedriver_mac64.zip'
            , file: 'chromedriver_mac64.zip'
            , sha: 'e4888451c75e0fcb889217a25bdf75e90d5c3963'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-macos.tar.gz'
            , file: 'geckodriver-v0.11.1'
            , sha: 'bf85ad73eb9e0dc3b33ef8604cf4db4ee34d34b5'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.24/chromedriver_win32.zip'
            , file: 'chromedriver_win32.exe'
            , sha: '8039b11a8ac3a7a2a9451187d732fe57b1d5eea9'}
          , { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/3.0/IEDriverServer_Win32_3.0.0.zip'
            , file: 'IEDriverServer_Win32_3.0.0.exe'
            , sha: 'bb400c8e5efb09c85a6b6f555abb5b66322d8081'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-win32.zip'
            , file: 'geckodriver-v0.11.1-win32.zip'
            , sha: '6851c1739d13bb69b49ad62bd62716e32e278edd'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/3.0/IEDriverServer_x64_3.0.0.zip'
            , file: 'IEDriverServer_x64_3.0.0.exe'
            , sha: '296d715f883953d10cab8bd123a48f755a23df11'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-win64.zip'
            , file: 'geckodriver-v0.11.1-win64.zip'
            , sha: '3f5e4f5e63330211d4ddbea24144a096008a6a76'}]}
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
                    }
                    async
                      .each(to_get
                          , function(op, cb) {
                              require('hash_file')(op.file, 'sha1', function(er, sha) {
                                if (er) return cb(er)
                                  console.log([op.file, sha])
                                  cb()
                                })
                          })
                })
      }}