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

    $scope.getFileName = function() {
        return $scope.fileName || 'qrcode.png';
    };
  }])
  .directive('qr', ['$timeout', '$window', function($timeout, $window){

    return {
      restrict: 'E',
      template: '<canvas ng-hide="image"></canvas><img ng-if="image" ng-src="{{canvasImage}}"/>',
      scope: {
        typeNumber: '=',
        correctionLevel: '=',
        inputMode: '=',
        size: '=',
        text: '=',
        image: '=',
        fileName: '='
      },
      controller: 'QrCtrl',
      link: function postlink(scope, element, attrs){

        if (scope.text === undefined) {
          throw new Error('The `text` attribute is required.');
        }

        var $canvas = element.find('canvas');
        var canvas = $canvas[0];
        var canvas2D = !!$window.CanvasRenderingContext2D;

        var link = 'download' in attrs ? document.createElement('a') : '';

        scope.TYPE_NUMBER = scope.getTypeNumeber();
        scope.TEXT = scope.getText();
        scope.CORRECTION = scope.getCorrection();
        scope.SIZE = scope.getSize();
        scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
        scope.canvasImage = '';
        scope.FILE_NAME = scope.getFileName();

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

        var render = function(canvas, value, typeNumber, correction, size, inputMode, fileName){
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
            scope.canvasImage = canvas.toDataURL() || '';
          }

          if (link) {
              link.download = fileName;
              link.href = canvas.toDataURL() || '';
              element.wrap(link);
          }
        };

        render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.FILE_NAME);

        $timeout(function(){
          scope.$watch('text', function(value, old){
            if (value !== old) {
              scope.TEXT = scope.getText();
              scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
              render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.FILE_NAME);
            }
          });

          scope.$watch('correctionLevel', function(value, old){
            if (value !== old) {
              scope.CORRECTION = scope.getCorrection();
              render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.FILE_NAME);
            }
          });

          scope.$watch('typeNumber', function(value, old){
            if (value !== old) {
              scope.TYPE_NUMBER = scope.getTypeNumeber();
              render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.FILE_NAME);
            }
          });

          scope.$watch('size', function(value, old){
            if (value !== old) {
              scope.SIZE = scope.getSize();
              render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.FILE_NAME);
            }
          });

          scope.$watch('inputMode', function(value, old){
            if (value !== old) {
              scope.INPUT_MODE = scope.getInputMode(scope.TEXT);
              render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE, scope.FILE_NAME);
            }
          });
        });

      }
    };
  }]);

})(window.QRCode);
