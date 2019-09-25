selenium-please
=================

A library to download and launch the Selenium Server.
This is clearly a copy of selenium-launcher, so credit where credit is due.
All the awesome is there, all the bugs are mine.

The idea is to get a Selenium server with browsers already installed.  It is a pain to download and maintain the right versions and options for each of the browers.  So this should just work.  Currently Chrome, Firefox, and Internet Explorer should just work.  Adding additional drivers to to the option hash should make these new browsers available.  Pull Requests to update remoteLibs.js are welcome.

The most basic use case
---

```javascript
var seleniumPlease = require('selenium-please')
seleniumPlease(function(er, selenium) {
  // selenium is running
  // selenium.host / selenium.port are available
  // selenium is a child process, so you can do selenium.kill()
  // selenium.stdout and selenium.stderr is piped to selenium.log
})
```

Selenium Please will also take an options hash
---

```javascript
var seleniumPlease = require('selenium-please')
var op = {// optional port
          port     : int (will default to random open port)
          // selenium file/download info if you want to use
          // a different version of selenium
        , selenium : {url : 'http://path/to/jar'
                    , file: 'file.name.of.jar'
                    , sha : 'optional sha of file'}
          // an array of drivers (browsers) to download/use
          // rememeber to get the right driver for your OS
        , drivers  : [{name : 'driver name e.g. chrome, ie, etc.'
                      , url : 'http://path/to/driver'
                      , file: 'file.name.of.driver'
                      , sha : 'optional sha of file'}]
          // additional java options
        , java     : ['array', 'of', 'additional', 'java', 'arguments', 'e.g. -Xmx 2G']
          // a place to log what selenium is doing (filepath || stream)
        , log      : 'path/to/log or a writable stream'
          // you want to see what options spawn('java') is getting?
        , debugJava: false
        }

seleniumPlease(op, function(er, selenium) {
  // selenium is running
  // selenium.host / selenium.port are available
  // selenium is a child process, so you can do selenium.kill()
})
```

You can also use it from the command line.  The only caveat is that it will download the Selenium jar and drivers into the current directory.  See usage for additional help.  Basically it just maps the option hash onto the command line.