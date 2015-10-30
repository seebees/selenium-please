// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'http://selenium-release.storage.googleapis.com/2.48/selenium-server-standalone-2.48.2.jar'
        , file: 'selenium-server-standalone-2.48.0.jar'
        , sha: '1faf8c00e4bf608d200e25f38ce627199db52cb1'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.19/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: 'b60089740af5a26d9220c1d21467a7b9fe6fb458'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.19/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: 'fc24cba33ca9cb56d4d06c9fdba68ab8fc211a7a'}
          ]
        , darwin: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.19/chromedriver_mac32.zip'
            , file: 'chromedriver_mac32'
            , sha: '12b04dba944771d1911b4d7dd86bec88f7f3ccbc'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.19/chromedriver_win32.zip'
            , file: 'chromedriver_win32'
            , sha: '86f113138925cdd3f4bfcb4afbb0d4f59e0858da'}
          , { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.48/IEDriverServer_Win32_2.48.0.zip'
            , file: 'IEDriverServer_Win32_2.48.0.exe'
            , sha: '2eaeaf158102d18caf2d0a5c6ce1bb506e2bd26c'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.48/IEDriverServer_x64_2.48.0.zip'
            , file: 'IEDriverServer_x64_2.48.0.exe'
            , sha: 'e3dd50eee880d7f8bb12a0b894a7a5eb51f2af03'}]}
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