export default angular.module('paperless.services')
  .factory('Utils', ['$mdBottomSheet', ($mdBottomSheet) => {
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
