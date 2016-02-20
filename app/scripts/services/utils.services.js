export default angular.module('paperless.services')
  .factory('Utils', [
    '$mdToast',
    '$mdBottomSheet', (
      $mdToast,
      $mdBottomSheet) => {
        
      return {
        showBottomSheet: (event, template) => {
          $mdBottomSheet.show({
            templateUrl: template,
            clickOutsideToClose: true,
            targetEvent: event
          });
        }
      };
    }
  ]);
