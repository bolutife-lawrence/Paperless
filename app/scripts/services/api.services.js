export default angular.module('paperless.services')
  .factory('Api', [() => {
    return {address : 'http://dms-api.herokuapp.com/api/v0.1/'};
  }]);
