(function(QRCode){
  'use strict';

  angular.module('ja.qr', [])
  .controller('QrCtrl', ['$scope', function($scope){
    $scope.getTypeNumeber = function(){
      return $scope.typeNumber || 0;
    };

    $scope.getCorrection = function(){
      var levels = {
        'L': 1,
        'M': 0,
        'Q': 3,
        'H': 2
      };

      var correctionLevel = $scope.correctionLevel || 0;
      return levels[correctionLevel] || 0;
    };

    $scope.getText = function(){
      return $scope.text || '';
    };

    $scope.getSize = function(){
      return $scope.size || 250;
    };

    $scope.getSize = function(){
      return $scope.size || 250;
    };

    $scope.getDarkColor = function(){
      return $scope.darkColor || '#000';
    };

    $scope.getLightColor = function(){
      return $scope.lightColor || '#FFF';
    };

    $scope.isNUMBER = function(text){
      var ALLOWEDCHARS = /^[0-9]*$/;
      return ALLOWEDCHARS.test(text);
    };

    $scope.isALPHA_NUM = function(text){
      var ALLOWEDCHARS = /^[0-9A-Z $%*+\-./:]*$/;
      return ALLOWEDCHARS.test(text);
    };

    $scope.is8bit = function(text){
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        if (code > 255) {
          return false;
        }
      }
      return true;
    };

    $scope.checkInputMode = function(inputMode, text){
      if (inputMode === 'NUMBER' && !$scope.isNUMBER(text)) {
        throw new Error('The `NUMBER` input mode is invalid for text.');
      }
      else if (inputMode === 'ALPHA_NUM' && !$scope.isALPHA_NUM(text)) {
        throw new Error('The `ALPHA_NUM` input mode is invalid for text.');
      }
      else if (inputMode === '8bit' && !$scope.is8bit(text)) {
        throw new Error('The `8bit` input mode is invalid for text.');
      }
      else if (!$scope.is8bit(text)) {
        throw new Error('Input mode is invalid for text.');
      }

      return true;
    };

    $scope.getInputMode = function(text){
      var inputMode = $scope.inputMode;
      inputMode = inputMode || ($scope.isNUMBER(text) ? 'NUMBER' : undefined);
      inputMode = inputMode || ($scope.isALPHA_NUM(text) ? 'ALPHA_NUM' : undefined);
      inputMode = inputMode || ($scope.is8bit(text) ? '8bit' : '');

      return $scope.checkInputMode(inputMode, text) ? inputMode : '';
    };
  }])
  .directive('qr', ['$timeout', '$window', function($timeout, $window){

    return {
      restrict: 'E',
      template: '<canvas ng-hide="image"></canvas><image ng-if="image" ng-src="{{canvasImage}}"/>',
      scope: {
        typeNumber: '=',
        correctionLevel: '=',
        inputMode: '=',
        size: '=',
        text: '=',
        image: '=',
        darkColor: '=',
        lightColor: '='
      },
      controller: 'QrCtrl',
      link: function postlink(scope, element, attrs){

        if (scope.text === undefined) {
          throw new Error('The `text` attribute is required.');
        }

        var canvas = element.find('canvas')[0];
        var canvas2D = !!$window.CanvasRenderingContext2D;

        scope.TYPE_NUMBER = scope.getTypeNumeber();
        scope.TEXT = scope.getText();
        scope.CORRECTION = scope.getCorrection();
        scope.SIZE = scope.getSize();
        scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
        scope.DARK_COLOR = scope.getDarkColor();
        scope.LIGHT_COLOR = scope.getLightColor();
        scope.canvasImage = 'http://lorempixel.com/500/500/';

        var draw = function(context, qr, modules, tile, darkColor, lightColor){
          for (var row = 0; row < modules; row++) {
            for (var col = 0; col < modules; col++) {
              var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                  h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
              context.fillStyle = qr.isDark(row, col) ? darkColor : lightColor;
              context.fillRect(Math.round(col * tile), Math.round(row * tile), w, h);
            }
          }
        };

        var render = function(canvas, value, typeNumber, correction, size, inputMode, darkColor, lightColor){
            console.log("darkColor: "+darkColor);
            console.log("lightColor: "+lightColor);
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
            draw(context, qr, modules, tile, darkColor, lightColor);
            scope.canvasImage = canvas.toDataURL();
          }
        };

        var rerender = function() {
          render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.DARK_COLOR, scope.LIGHT_COLOR);
        };

        rerender();

        $timeout(function(){
          scope.$watch('text', function(value, old){
            if (value !== old) {
              scope.TEXT = scope.getText();
              scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
              rerender();
            }
          });

          scope.$watch('correctionLevel', function(value, old){
            if (value !== old) {
              scope.CORRECTION = scope.getCorrection();
              rerender();
            }
          });

          scope.$watch('typeNumber', function(value, old){
            if (value !== old) {
              scope.TYPE_NUMBER = scope.getTypeNumeber();
              rerender();
            }
          });

          scope.$watch('size', function(value, old){
            if (value !== old) {
              scope.SIZE = scope.getSize();
              rerender();
            }
          });

          scope.$watch('inputMode', function(value, old){
            if (value !== old) {
              scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
              rerender();
            }
          });

          scope.$watch('darkColor', function(value, old){
            if (value !== old) {
                console.log("darkColor changed: "+value);
              scope.DARK_COLOR = scope.getDarkColor();
              rerender();
            }
          });

          scope.$watch('lightColor', function(value, old){
            if (value !== old) {
              scope.LIGHT_COLOR = scope.getLightColor();
              rerender();
            }
          });
        });

      }
    };
  }]);

})(window.QRCode);
