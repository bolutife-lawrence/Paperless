export default angular.module('paperless.services')
  .factory('Roles', [
    '$resource',
    '$http',
    'Api', (
      $resource,
      $http,
      Api) => {
        
      var obj = $resource(`${Api.address}roles/:id`, {
        id: '@id'
      }, {
        update: {
          // this method issues a PUT request
          method: 'PUT'
        }
      }, {
        stripTrailingSlashes: false
      }, {
        'query': {
          method: 'GET',
          isArray: false
        }
      });

      return obj;
    }
  ]);
