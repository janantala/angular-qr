describe('ja.qr', function() {

  beforeEach(module('ja.qr'));

  var rootscope;
  beforeEach(inject(function($rootScope) {
    rootScope = $rootScope;
  }));

  var elm, scope;

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element('<qr type-number="0" correction-level="\'M\'" size="200" text="\'hello there\'"></qr>');
    scope = $rootScope;

    $compile(elm)(scope);
    scope.$digest();
  }));

  it('should run', function(){

  });
});