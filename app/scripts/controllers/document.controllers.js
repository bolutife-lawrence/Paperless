export default angular.module('paperless.controllers')
  .controller('docCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$state',
    '$stateParams',
    '$mdBottomSheet',
    'Utils',
    'Roles',
    'Users',
    'Alert',
    'Documents', (
      $scope,
      $rootScope,
      $timeout,
      $state,
      $stateParams,
      $mdBottomSheet,
      Utils,
      Roles,
      Users,
      Alert,
      Documents) => {

      $scope.init = () => {
        $scope.hidden = false;
        $scope.isOpen = false;
        $scope.hover = false;

        $scope.menuItems = [{
          name: 'Delete document',
          icon: 'fa fa-trash-o',
          direction: 'bottom',
          action: 'deleteDoc'
        }, {
          name: 'Edit document',
          icon: 'fa fa-pencil',
          direction: 'top',
          action: 'loadUpdatedDocModal'
        }];

        $scope.noFeaturedUsersMsg = 'None for now';
        $scope.getDoc();
      };

      $scope.initSelectedRoles = () => {
        $scope.selectedRoles = [];
      };

      $scope.callFunction = (name) => {
        if (angular.isFunction($scope[name])) {
          $scope[name].call();
        }
      };

      $scope.toggle = (item, list) => {
        var index = list.indexOf(item);
        if (index > -1) {
          list.splice(index, 1);
        } else {
          list.push(item);
        }
      };

      $scope.exists = (item, list) => list.indexOf(item) > -1;

      $scope.hasPrivilege = () => {
        return $rootScope.currentUser._id === $scope.viewDoc.userId[0]._id;
      };

      $scope.getFeaturedUsers = () => {
        let _roles = $scope.viewDoc.roles.map((role) => role._id);
        Users.featuredUsers(_roles, (err, res) => {
          if (!err) {
            $scope.featuredUsers = res.data.users.docs;
          }
        });
      };

      $scope.getSelectedRoles = () => {
        $scope.selectedRoles = [];
        if ($scope.viewDoc.roles.length < 1) {
          return;
        }

        let selectedRoles = $scope.viewDoc.roles.map((role) => role.title);
        $scope.selectedRoles = selectedRoles;
      };

      $scope.getDoc = () => {
        Documents.get({
          id: $stateParams.doc_id
        }, res => {
          if (res.success) {
            $scope.viewDoc = res.doc;
          }
          $scope.getFeaturedUsers();
          $scope.getSelectedRoles();
          $scope.getDocOwner();
        });
      };

      $scope.getDocOwner = () => {
        let currentUserId = $rootScope.currentUser._id,
          docOwnerId = $scope.viewDoc.userId[0]._id;
        if (currentUserId === docOwnerId) {
          $scope.docOwner = 'You';
        } else {
          let fullname = $scope.viewDoc.userId[0].name;
          $scope.docOwner = `${fullname.last} ${fullname.first}`;
        }
      };

      $scope.deleteDoc = () => {
        swal({
          title: 'Are you sure?',
          text: 'You will not be able to recover this document!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, delete it!',
          closeOnConfirm: false
        }, () => {
          Documents.delete({
            id: $stateParams.doc_id
          }, () => {
            Alert.show({
              title: 'Deleted!',
              text: 'Document has been deleted.',
              type: 'success',
              showConfirmButton: false,
              timer: 2000
            });

            $state.go('dashboard.user-documents.own');
          }, err => {
            Alert.show({
              title: 'Document was not deleted!',
              text: err.data.message,
              type: 'error',
              showConfirmButton: false,
              timer: 2000
            });
          });
        });
      };

      $scope.updateDoc = () => {
        let docDetails = angular.copy($scope.viewDoc);
        docDetails.roles = $scope.selectedRoles;

        if (docDetails.roles.length < 1) {
          Alert.show({
            title: 'Sorry!',
            text: 'Select atleast a role',
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
          return;
        }

        Documents.update({
          id: $stateParams.doc_id
        }, docDetails, () => {
          $state.go('dashboard.user-documents.own', {
            id: $rootScope.currentUser._id
          });

          $mdBottomSheet.hide();

          Alert.show({
            title: 'updated!',
            text: 'Document has been updated.',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
        }, err => {
          Alert.show({
            title: 'Something went wrong!',
            text: err.data.message,
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
        });
      };

      $scope.loadRoles = () => {
        Roles.get(res => {
          let roles = res.roles.docs,
            _roles = roles.filter((role) => {
              let lowercaseRole = role.title.toLowerCase();
              return ['superadmin', 'admin'].indexOf(lowercaseRole) === -1;
            });
          $scope.roles = _roles;
        });
      };

      $scope.createDoc = () => {
        $scope.newDoc.roles = $scope.selectedRoles;

        if ($scope.selectedRoles.length < 1) {
          Alert.show({
            title: 'Sorry!',
            text: 'Select atleast a role',
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
          return;
        }

        Documents.save($scope.newDoc, () => {
          $state.go('dashboard.user-documents.own', {}, {
            reload:true
          });
          $mdBottomSheet.hide();

          Alert.show({
            title: 'Created!',
            text: 'Document created.',
            type: 'success',
            showConfirmButton: false,
            timer: 2000
          });
        }, err => {
          Alert.show({
            title: 'Oops.',
            text: err.data.message,
            type: 'error',
            showConfirmButton: false,
            timer: 2000
          });
        });
      };

      $scope.loadUpdatedDocModal = $event => {
        Utils.showBottomSheet($event, 'views/update-document.html');
      };

      $scope.$watch('$scope.isOpen', (isOpen) => {
        if (isOpen) {
          $timeout(() => {
            $scope.tooltipVisible = $scope.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = $scope.isOpen;
        }
      });
    }
  ]);
