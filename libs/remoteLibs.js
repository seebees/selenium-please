// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.1.jar'
        , file: 'selenium-server-standalone-2.53.1.jar'
        , sha: '4f50daba7ac7af61786bc31767cbb41ac5381672'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.23/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: '0bfc2cf820649bcf5fc297007aec097e1e92bf9f'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.23/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: '09847b85685c4d1e6228ce59294fba729c3fadaf'}
          ]
        , darwin: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.23/chromedriver_mac64.zip'
            , file: 'chromedriver_mac64.zip'
            , sha: '79fce5d12d767a5feb08ded1a557cafaae34b2aa'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'http://chromedriver.storage.googleapis.com/2.23/chromedriver_win32.zip'
            , file: 'chromedriver_win32'
            , sha: 'c7dc0f276a1ef5f2c58dbebcfb596a99cfa91a4e'}
          , { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.53/IEDriverServer_Win32_2.53.1.zip'
            , file: 'IEDriverServer_Win32_2.53.1.exe'
            , sha: '24b957f53c68fb4d022a53d47f021ea0a6edbf55'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'http://selenium-release.storage.googleapis.com/2.53/IEDriverServer_x64_2.53.1.zip'
            , file: 'IEDriverServer_x64_2.53.1.exe'
            , sha: 'b31825ece8ffbb66a5a5dea5f4f83875778363b0'}]}
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