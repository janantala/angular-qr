/*
 * angular-qr v0.0.4
 * (c) 2013 Jan Antala http://janantala.com
 * License: MIT
 */

(function(QRCode){
  'use strict';

  angular.module('ja.qr', [])
  .directive('qr', ['$timeout', '$window', function($timeout, $window){

    return {
      restrict: 'E',
      template: '<canvas></canvas>',
      scope: {
        typeNumber: '@',
        correctionLevel: '@',
        inputMode: '@',
        size: '@',
        text: '='
      },
      link: function postlink(scope, element, attrs){

        var getTypeNumeber = function(){
          return scope.typeNumber || 0;
        };

        var getCorrection = function(){
          var levels = {
            'L': 1,
            'M': 0,
            'Q': 3,
            'H': 2
          };

          var correctionLevel = scope.correctionLevel || 0;
          return levels[correctionLevel] || 0;
        };

        var getText = function(){
          return scope.text || '';
        };

        var getSize = function(){
          return scope.size || 250;
        };

        var isNUMBER = function(text){
          var ALLOWEDCHARS = /^[0123456789]*$/;
          return ALLOWEDCHARS.test(text);
        };

        var isALPHA_NUM = function(text){
          var ALLOWEDCHARS = /^[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:]*$/;
          return ALLOWEDCHARS.test(text);
        };

        var is8bit = function(text){
          for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code > 256) {
              return false;
            }
          }
          return true;
        };

        var checkInputMode = function(inputMode, text){
          if (inputMode === 'NUMBER' && !isNUMBER(text)) {
            throw new Error('The `NUMBER` input mode is invalid for text.');
          }
          else if (inputMode === 'isALPHA_NUM' && !isALPHA_NUM(text)) {
            throw new Error('The `ALPHA_NUM` input mode is invalid for text.');
          }
          else if (inputMode === '8bit' && !is8bit(text)) {
            throw new Error('The `8bit` input mode is invalid for text.');
          }
          else if (!is8bit(text)) {
            throw new Error('Input mode is invalid for text.');
          }

          return true;
        };

        var getInputMode = function(text){
          var inputMode = scope.inputMode;
          inputMode = inputMode || (isNUMBER(text) ? 'NUMBER' : undefined);
          inputMode = inputMode || (isALPHA_NUM(text) ? 'ALPHA_NUM' : undefined);
          inputMode = inputMode || (is8bit(text) ? '8bit' : '');

          return checkInputMode(inputMode, text) ? inputMode : '';
        };

        if (scope.text === undefined) {
          throw new Error('The `text` attribute is required.');
        }

        var canvas = element.find('canvas')[0];
        var canvas2D = !!$window.CanvasRenderingContext2D;

        var TYPE_NUMBER = getTypeNumeber();
        var TEXT = getText();
        var CORRECTION = getCorrection();
        var SIZE = getSize();
        var INPUT_MODE = getInputMode(TEXT);

        var draw = function(context, qr, modules, tile){
          for (var row = 0; row < modules; row++) {
            for (var col = 0; col < modules; col++) {
              var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                  h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
              context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
              context.fillRect(Math.round(col * tile), Math.round(row * tile), w, h);
            }
          }
        };

        var render = function(canvas, value, typeNumber, correction, size, inputMode){
          var trim = /^\s+|\s+$/g;
          var text = value.replace(trim, '');

          var qr = new QRCode(typeNumber, correction, inputMode);
          qr.addData(text);
          qr.make();

          var context = canvas.getContext('2d');

          var modules = qr.getModuleCount();
          var tile = size / modules;
          canvas.width = canvas.height = size;

          if (canvas2D) {
            draw(context, qr, modules, tile);
          }
        };

        render(canvas, TEXT, TYPE_NUMBER, CORRECTION, SIZE, INPUT_MODE);

        $timeout(function(){
          scope.$watch('text', function(value, old){
            if (value !== old) {
              TEXT = getText();
              INPUT_MODE = getInputMode(TEXT);
              render(canvas, TEXT, TYPE_NUMBER, CORRECTION, SIZE, INPUT_MODE);
            }
          });

          scope.$watch('correctionLevel', function(value, old){
            if (value !== old) {
              CORRECTION = getCorrection();
              render(canvas, TEXT, TYPE_NUMBER, CORRECTION, SIZE, INPUT_MODE);
            }
          });

          scope.$watch('typeNumber', function(value, old){
            if (value !== old) {
              TYPE_NUMBER = getTypeNumeber();
              render(canvas, TEXT, TYPE_NUMBER, CORRECTION, SIZE, INPUT_MODE);
            }
          });

          scope.$watch('size', function(value, old){
            if (value !== old) {
              SIZE = getSize();
              render(canvas, TEXT, TYPE_NUMBER, CORRECTION, SIZE, INPUT_MODE);
            }
          });

          scope.$watch('inputMode', function(value, old){
            if (value !== old) {
              INPUT_MODE = getInputMode(TEXT);
              render(canvas, TEXT, TYPE_NUMBER, CORRECTION, SIZE, INPUT_MODE);
            }
          });
        });

      }
    };
  }]);

})(window.QRCode);
