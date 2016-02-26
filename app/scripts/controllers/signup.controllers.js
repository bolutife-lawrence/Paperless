export default angular.module('paperless.controllers')
  .controller('signupCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'Users',
    'Auth', (
      $scope,
      $rootScope,
      $state,
      Users,
      Auth) => {

      $scope.signup = () => {
        Users.save($scope.user, (res) => {
          var sessionDetails = {
            id: res.user._id,
            token: res.token
          };

          Auth.setToken(JSON.stringify(sessionDetails));
          $rootScope.currentUser = res.user;

          $state.go('dashboard.user-documents.own', {
            id: $rootScope.currentUser._id
          });
        }, (err) => {
          swal({
            title: 'Sorry. We couldn\'t sign you in.',
            text: err.data.message,
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
        });
      };
    }
  ]);
