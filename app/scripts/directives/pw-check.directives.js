export default angular.module('paperless.directives')
  .directive('pwCheck', () => {
    return {
      require: '^ngModel',
      link: (scope, elm, attr, ctrl) => {
        ctrl.$parsers.unshift((viewValue) => {
          var noMatch = viewValue !== scope.$eval(attr.pwCheck);
          ctrl.$setValidity('noMatch', !noMatch);
        });
      }
    };
  });
