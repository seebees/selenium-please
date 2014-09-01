// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'http://selenium-release.storage.googleapis.com/2.42/selenium-server-standalone-2.42.2.jar'
        , file: 'selenium-server-standalone-2.42.2.jar'
        , sha: '921005b6628821c9a29de6358917a82d1e3dfa94'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: '0bb95f574ce0a242c37a82bc3540735591f381b4'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: '71b122753e891b4d2e1380f39c4e2332411d5f0a'}
          ]
        , darwin_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_mac32.zip'
            , file: 'chromedriver_mac32'
            , sha: '27c4b663b8a46c5355cb62f85ee9ea01561d6e7a'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.10/chromedriver_win32.zip'
            , file: 'chromedriver_win32'
            , sha: '37a813646b5baf63f9b86fe4a12b352dbb1de869'}
          , { name: 'ie'
            , url: 'https://selenium.googlecode.com/files/IEDriverServer_Win32_2.39.0.zip'
            , file: 'IEDriverServer_Win32_2.39.0.exe'
            , sha: 'd26c47ff20291327b3d813a0a75be05e74178c21'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'https://selenium.googlecode.com/files/IEDriverServer_x64_2.39.0.zip'
            , file: 'IEDriverServer_x64_2.39.0.exe'
            , sha: 'b3b6a3d31cdea6dc5a66dd0d66192df7cb2cbb31'}]}
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