export default angular.module('paperless.controllers')
  .controller('loginCtrl', [
    '$scope',
    '$state',
    '$rootScope',
    'Users',
    'Auth',(
      $scope,
      $state,
      $rootScope,
      Users,
      Auth) => {

    $scope.login = () => {
      Users.login($scope.user, (err, res) => {
        if (!err) {
          var sessionDetails = {
            id: res.data.user._id,
            token: res.data.token
          };

          Auth.setToken(JSON.stringify(sessionDetails));
          $rootScope.currentUser = res.data.user;

          $state.go('dashboard.user-documents.own', {
            id: $rootScope.currentUser._id
          });
        } else {
          swal({
            title: 'Oops...Something went wrong',
            text: err.data.message,
            type: 'error',
            showConfirmButton: false,
            timer: 4000
          });
        }
      });
    };

    $scope.fbLogin = () => Users.fbLogin();
    $scope.googleLogin = () => Users.gLogin();
  }]);
