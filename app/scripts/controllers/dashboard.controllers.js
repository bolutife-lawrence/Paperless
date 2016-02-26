 export default angular.module('paperless.controllers')
  .controller('dashboardCtrl', [
    '$scope',
    '$state',
    '$mdSidenav',
    '$rootScope',
    'Auth', (
      $scope,
      $state,
      $mdSidenav,
      $rootScope,
      Auth) => {

      $scope.init = () => {

        $rootScope.$on('currentUser:updated', (event, currentUser) => {
          $rootScope.currentUser = currentUser;
        });

        $scope.menuItems = [];

        if ($rootScope.currentUser.role.length > 0) {
          var currentUserRole = $rootScope.currentUser.role[0].title;

          if (['superadmin', 'admin'].indexOf(currentUserRole) !== -1) {
            var adminMenu = [{
              link: 'dashboard.users',
              title: 'Users',
              icon: 'fa fa-th-list'
            }, {
              link: 'dashboard.roles',
              title: 'Roles',
              icon: 'fa fa-th-list'
            }];

            adminMenu.forEach((item) => {
              $scope.menuItems.push(item);
            });
          }
        }

        var userMenu = [{
          link: 'dashboard.user-documents.own',
          title: 'Documents',
          icon: 'fa fa-th-list'
        }, {
          link: 'dashboard.user-profile',
          title: 'Profile',
          icon: 'fa fa-user'
        }];

        userMenu.forEach((item) => {
          $scope.menuItems.push(item);
        });

        if ($rootScope.currentUser.role.length < 1) {
          swal({
            title: ' Hey there! Welcome to Paperless',
            text: 'Looks like you don\'t have a role yet. You need to' +
            ' select a role to start creating documents. Kindly select a' +
            ' role from your profile. Please note that you cannot change your' +
            ' role once you\'ve selected one. Enjoy!',
            type: 'success',
            showConfirmButton: true
          }, () => {
            $state.go('dashboard.user-profile', {
              id: $rootScope.currentUser._id
            });
          });
        }
      };

      $scope.toggleNav = () => {
        $mdSidenav('left').toggle();
      };

      $scope.logout = () => {
        Auth.logout();
        delete $rootScope.currentUser;
        $state.go('welcome');
      };
    }
  ]);
