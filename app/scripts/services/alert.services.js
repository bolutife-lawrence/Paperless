angular.module('paperless.services')
  .factory('Alert', [() => {
    return {
      show: config => swal(config),
      showWithConfirm: config => swal(config)
    };
  }]);
