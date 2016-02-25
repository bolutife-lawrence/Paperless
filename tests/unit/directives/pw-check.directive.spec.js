describe('Password check directive', () => {
  var elm,
    _elm,
    isolated,
    scope;

  beforeEach(module('paperless'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope;

    elm = angular.element('<input ng-model=\'{{password}}\'/>');
    _elm = angular.element('<input pw-check=\'{{password}}\'/>');

    scope.password = '12345';
    scope.cpassword = '12345';

    $compile(elm)(scope);
    $compile(_elm)(scope);
    scope.$digest();

    isolated = elm.isolateScope();
  }));
});
