describe('ja.qr', function() {

  beforeEach(module('ja.qr'));

  // var elm, scope, ctrl;

  // beforeEach(inject(function($rootScope, $compile) {
  //   elm = angular.element('<qr type-number="0" correction-level="\'M\'" size="200" text="\'hello there\'"></qr>');
  //   scope = $rootScope;

  //   $compile(elm)(scope);
  //   scope.$digest();
  // }));
  
  describe('QrCtrl', function() {

    var scope, ctrl;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('QrCtrl', {$scope: scope });
    }));

    it('should detect NUMBER text', function() {
      expect(scope.isNUMBER('123')).toBe(true);
      expect(scope.isALPHA_NUM('123')).toBe(true);
      expect(scope.is8bit('123')).toBe(true);
    });

    it('should detect ALPHA_NUM text', function() {
      expect(scope.isNUMBER('A123')).toBe(false);
      expect(scope.isALPHA_NUM('A123')).toBe(true);
      expect(scope.is8bit('A123')).toBe(true);
    });

    it('should detect 8bit text', function() {
      expect(scope.isNUMBER('aA123')).toBe(false);
      expect(scope.isALPHA_NUM('aA123')).toBe(false);
      expect(scope.is8bit('aA123')).toBe(true);
    });

    it('should detect non 8bit text', function() {
      expect(scope.isNUMBER('čaA123')).toBe(false);
      expect(scope.isALPHA_NUM('čaA123')).toBe(false);
      expect(scope.is8bit('čaA123')).toBe(false);
    });

    it('should check text input mode', function() {
      expect(scope.checkInputMode('NUMBER', '123')).toBe(true);
      expect(scope.checkInputMode('ALPHA_NUM', '123')).toBe(true);
      expect(scope.checkInputMode('8bit', '123')).toBe(true);

      expect(scope.checkInputMode('ALPHA_NUM', 'A123')).toBe(true);
      expect(scope.checkInputMode('8bit', 'A123')).toBe(true);

      expect(scope.checkInputMode('8bit', 'aA123')).toBe(true);
    });

    it('should get the simpliest input mode', function() {
      expect(scope.getInputMode('123')).toBe('NUMBER');
      expect(scope.getInputMode('123')).not.toBe('ALPHA_NUM');
      expect(scope.getInputMode('123')).not.toBe('8bit');

      expect(scope.getInputMode('A123')).not.toBe('NUMBER');
      expect(scope.getInputMode('A123')).toBe('ALPHA_NUM');
      expect(scope.getInputMode('A123')).not.toBe('8bit');
      
      expect(scope.getInputMode('aA123')).not.toBe('NUMBER');
      expect(scope.getInputMode('aA123')).not.toBe('ALPHA_NUM');
      expect(scope.getInputMode('aA123')).toBe('8bit');

      expect(scope.getInputMode('A,123')).not.toBe('NUMBER');
      expect(scope.getInputMode('A,123')).not.toBe('ALPHA_NUM');
      expect(scope.getInputMode('A,123')).toBe('8bit');
    });

  });
});