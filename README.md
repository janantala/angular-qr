# angular-qr v0.0.3 [![Build Status](https://travis-ci.org/janantala/angular-qr.png?branch=master)](https://travis-ci.org/janantala/angular-qr)

QR code generator for AngularJS

### Demo

Check out http://janantala.github.io/angular-qr/demo/

# Requirements

- AngularJS v 1.0+
- [qrcode.js](https://github.com/janantala/qrcode) from lib directory

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management. Add

    dependencies: {
        "angular-qr": "latest"
    }

To your `bower.json` file. Then run

    bower install

This will copy the angular-qr files into your `bower_components` folder, along with its dependencies. Load the script files in your application:

    <script type="text/javascript" src="bower_components/angular/angular.js"></script>
    <script type="text/javascript" src="bower_components/angular-qr/lib/qrcode.js"></script>
    <script type="text/javascript" src="bower_components/angular-qr/src/angular-qr.js"></script>

Add the **ja.qr** module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['ja.qr']);

## Directive    

```
<qr type-number="0" correction-level="'M'" size="200" input-mode="'ALPHA_NUM'" text="string"></qr>
```

#### type-number
- 1-40
- use 0 as auto

#### correction-level
- L
- M
- Q
- H
 
#### size
Size in pixels

#### input-mode
- `NUMBER`: *0, 1, 2, 3, 4, 5, 6, 7, 8, 9*
- `ALPHA_NUM`: *0–9, A–Z (upper-case only), space, $, %, *, +, -, ., /, :*
- `8bit`: *[ISO 8859-1](http://en.wikipedia.org/wiki/ISO_8859-1)*

#### text
Your text to encode

# Contributing

Contributions are welcome. Please make a pull request against canary branch and do not bump versions. Also include tests.

# Testing

We use karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:

    npm install -g grunt-cli
    npm install
    bower install
    grunt

The karma task will try to open Chrome as a browser in which to run the tests. Make sure this is available or change the configuration in `test/test.config.js` 


# License

The MIT License

Copyright (c) 2013 Jan Antala, http://janantala.com
