export default angular.module('paperless.controllers')
  .controller('userProfileCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$state',
    'ngProgressFactory',
    'Auth',
    'Users',
    'Roles',
    'Avatar', (
      $scope,
      $rootScope,
      $stateParams,
      $state,
      ngProgressFactory,
      Auth,
      Users,
      Roles,
      Avatar
    ) => {

      $scope.init = () => {
        if ($rootScope.currentUser.img_public_id) {
          $scope.imgPublicId = $rootScope.currentUser.img_public_id;
        }

        $scope.progressBar = ngProgressFactory.createInstance();
        $scope.resetPassword = false;
      };

      $scope.changeProfilePic = (file) => {
        Avatar.uploadImage(file).then(res => {
            $rootScope.currentUser.img_url = res.data.img_url;
            $rootScope.currentUser.img_public_id = res.data.img_public_id;
            $scope.imgPublicId = res.data.img_public_id;
            swal({
              title: 'Done!',
              text: 'Image uploaded',
              type: 'success',
              showConfirmButton: false,
              timer: 2000
            });
          }, () => {
            swal({
              title: 'Oops...',
              text: 'An error occured while uploading. Try after some time.',
              type: 'error',
              showConfirmButton: false,
              timer: 2000
            });
          },
          evt => {
            $scope.progressBar.start();
            var progess = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressBar.set(progess);
            if (progess === 100) $scope.progressBar.complete();
          });
      };

      $scope.removeProfilePic = (imgPublicId) => {
        $scope.progressBar.start();
        Avatar.removeImage(imgPublicId).then((res) => {
          $rootScope.currentUser.img_url = res.data.img_url;
          $rootScope.currentUser.img_public_id = null;
          $scope.imgPublicId = null;
          swal({
            title: 'Done!',
            text: 'Image deleted',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          $scope.progressBar.complete();
        }, () => {
          swal({
            title: 'Oops...',
            text: 'Image could not be deleted',
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
        });
      };

      $scope.loadRoles = () => {
        Roles.get(res => {
          var roles = res.roles.docs,
            _roles = roles.filter((role) => {
              var lowercaseRole = role.title.toLowerCase();
              return ['superadmin', 'admin'].indexOf(lowercaseRole) === -1;
            });
          $scope.roles = _roles;
        });
      };

      $scope.updateUser = () => {

        var currentUserInfo = angular.copy($rootScope.currentUser);

        if ($rootScope.currentUser.role.length > 0) {
          currentUserInfo.role = $rootScope.currentUser.role[0].title;
        }

        // Prepare fullname for update
        currentUserInfo.lastname = currentUserInfo.name.last;
        currentUserInfo.firstname = currentUserInfo.name.first;

        Users.update({
          id: $stateParams.id
        }, currentUserInfo, (res) => {

          let updateSession = {
            id: $stateParams.id,
            token: res.token
          };
          $rootScope.currentUser = res.user;

          swal({
            title: 'Updated!',
            text: 'Your profile has been updated.',
            type: 'success',
            showConfirmButton: false,
            timer: 3000
          });

          Auth.setToken(JSON.stringify(updateSession));
        }, (err) => {

          swal({
            title: 'Oops... Your profile was not updated.',
            text: err.data.message,
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
        });
      };

      $scope.showPasswordFields = () => {
        $scope.resetPassword = !$scope.resetPassword;
      };
    }
  ]);
