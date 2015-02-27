// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'http://selenium-release.storage.googleapis.com/2.45/selenium-server-standalone-2.45.0.jar'
        , file: 'selenium-server-standalone-2.45.0.jar'
        , sha: '9bc872d1f364a3104257b1f8e055a342228259c3'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.14/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: '04f2fa2c1d5d7da0e85ab6157f079338e1389a15'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.14/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: 'e8b4c428d03246d18882d3c5309ac58a58ba782b'}
          ]
        , darwin: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.14/chromedriver_mac32.zip'
            , file: 'chromedriver_mac32'
            , sha: '3289e91ceb922fa55e3e90016363bedd3efb9090'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.14/chromedriver_win32.zip'
            , file: 'chromedriver_win32'
            , sha: '350005c67acf3074faf144e54ff740c78507c0f9'}
          , { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.45/IEDriverServer_Win32_2.45.0.zip'
            , file: 'IEDriverServer_Win32_2.45.0.exe'
            , sha: '7987e2af5e474954de99b9a1388ad1be0bb6fb6f'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.45/IEDriverServer_x64_2.45.0.zip'
            , file: 'IEDriverServer_x64_2.45.0.exe'
            , sha: '8a229a335a034a53e74117ed67e74d40a2ea3826'}]}
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