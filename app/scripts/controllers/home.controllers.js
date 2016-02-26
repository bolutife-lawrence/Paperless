export default angular.module('paperless.controllers')
  .controller('homeCtrl', [
    '$scope',
    '$state', (
      $scope,
      $state) => {

    $scope.init = () => {
      $state.go('welcome.login');
    };

    // Iniitialize
    $scope.init();
  }]);
