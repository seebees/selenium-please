// how to get all the remote libs and such
//https://code.google.com/p/selenium/wiki/SafariDriver
module.exports = {
        selenium: {
          url: 'https://selenium-release.storage.googleapis.com/3.4/selenium-server-standalone-3.4.0.jar'
        , file: 'selenium-server-standalone-3.4.0.jar'
        , sha: '4359bc28def5a14b9070e014a4f86f47b0761806'}
      , platform: {
          linux_x32: [
            { name: 'chrome'
            , url: 'https://chromedriver.storage.googleapis.com/2.33/chromedriver_linux32.zip'
            , file: 'chromedriver_linux32'
            , sha: '3d0c563b5654cf0ca27736033a9ef4aae6b66960'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.19.0/geckodriver-v0.19.0-linux32.tar.gz'
            , file: 'geckodriver-v0.19.0_linux32'
            , sha: 'a51bdda75cdc3b4f51668623a7d922c77ab13a69'}
          ]
        , linux_x64: [
            { name: 'chrome'
            , url: 'https://chromedriver.storage.googleapis.com/2.33/chromedriver_linux64.zip'
            , file: 'chromedriver_linux64'
            , sha: '1ed49734a8987c5c03dfcac083c33310692b142b'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.19.0/geckodriver-v0.19.0-linux64.tar.gz'
            , file: 'geckodriver-v0.19.0_linux64'
            , sha: '64decacff2095a1974958f7c15d611d6f064c1f5'}
          ]
        , darwin: [
            { name: 'chrome'
            , url: 'https://chromedriver.storage.googleapis.com/2.33/chromedriver_mac64.zip'
            , file: 'chromedriver_mac64.zip'
            , sha: '3b3abb2244efb0f243ebe88d7517e25e24fa3ce5'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.19.0/geckodriver-v0.19.0-macos.tar.gz'
            , file: 'geckodriver-v0.19.0'
            , sha: '3788704e86885205b8b58ba9f2c56a75a971e3ac'}
          ]
        , win32: [
            { name: 'chrome'
            , url: 'https://chromedriver.storage.googleapis.com/2.33/chromedriver_win32.zip'
            , file: 'chromedriver_win32.exe'
            , sha: 'aeea0c8a00153d87636a5e567c9b7a869637e36c'}
          , { name: 'ie'
            , url: 'https://selenium-release.storage.googleapis.com/3.0/IEDriverServer_Win32_3.0.0.zip'
            , file: 'IEDriverServer_Win32_3.0.0.exe'
            , sha: 'bb400c8e5efb09c85a6b6f555abb5b66322d8081'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.19.0/geckodriver-v0.19.0-win32.zip'
            , file: 'geckodriver-v0.19.0-win32.zip'
            , sha: 'b4366f8438f975fbed470e99e3b663a9e4d339b0'}
          ]
        , win64: [
            { name: 'ie'
            , url: 'https://selenium-release.storage.googleapis.com/3.0/IEDriverServer_x64_3.0.0.zip'
            , file: 'IEDriverServer_x64_3.0.0.exe'
            , sha: '296d715f883953d10cab8bd123a48f755a23df11'}
          ,  { name: 'gecko'
            , url: 'https://github.com/mozilla/geckodriver/releases/download/v0.19.0/geckodriver-v0.19.0-win64.zip'
            , file: 'geckodriver-v0.19.0-win64.zip'
            , sha: '1daadd40fbee83d2634f1c244ae281cbd1035f14'}]}
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