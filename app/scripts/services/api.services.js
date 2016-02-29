export default angular.module('paperless.services')
  .factory('Api', [() => {
    return {address : 'http://localhost:9000/api/v0.1/'};
  }]);
