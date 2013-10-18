/*
 * angular-qr v0.0.2
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
        typeNumber: '=',
        correctionLevel: '=',
        inputMode: '=',
        size: '=',
        text: '='
      },
      link: function postlink(scope, element, attrs){
        var levels = {
          'L': 1,
          'M': 0,
          'Q': 3,
          'H': 2
        };

        var canvas = element.find('canvas')[0];
        var canvas2D = !!$window.CanvasRenderingContext2D;

        scope.typeNumber = scope.typeNumber || 0;
        scope.correctionLevel = scope.correctionLevel || 0;
        scope.text = scope.text || '';
        var correction = levels[scope.correctionLevel] || 0;

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

        var render = function(canvas, value, typeNumber, correction){
          var trim = /^\s+|\s+$/g;
          var text = value.replace(trim, '');

          var qr = new QRCode(typeNumber, correction, scope.inputMode);
          qr.addData(text);
          qr.make();

          var context = canvas.getContext('2d');

          var modules = qr.getModuleCount();
          scope.size = scope.size || modules * 2;
          var tile = scope.size / modules;
          canvas.width = canvas.height = scope.size;

          if (canvas2D) {
            draw(context, qr, modules, tile);
          }
        };

        render(canvas, scope.text, scope.typeNumber, correction);

        $timeout(function(){
          scope.$watch('text', function(value, old){
            if (value !== old) {
              render(canvas, scope.text, scope.typeNumber, correction);
            }
          });

          scope.$watch('correctionLevel', function(value, old){
            if (value !== old) {
              render(canvas, scope.text, scope.typeNumber, correction);
            }
          });

          scope.$watch('typeNumber', function(value, old){
            if (value !== old) {
              render(canvas, scope.text, scope.typeNumber, correction);
            }
          });

          scope.$watch('size', function(value, old){
            if (value !== old) {
              render(canvas, scope.text, scope.typeNumber, correction);
            }
          });

          scope.$watch('inputMode', function(value, old){
            if (value !== old) {
              render(canvas, scope.text, scope.typeNumber, correction);
            }
          });
        });

      }
    };
  }]);

})(window.QRCode);
