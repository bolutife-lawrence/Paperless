export default angular.module('paperless.services')
  .factory('Documents', [
    '$resource',
    '$http',
    'Api', (
      $resource,
      $http,
      Api) => {

      var obj = $resource(`${Api.address}documents/:id`, {
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

      obj.userDocs = (userId, page, limit, cb) => {
        var params = {
          params: {
            page: page,
            limit: limit || 10
          }
        };

        $http.get(`${Api.address}users/${userId}/documents`, params)
          .then((res) => {
            cb(null, res);
          })
          .catch((err) => {
            cb(err);
          });
      };

      obj.featuredDocs = (roleId, page, limit, cb) => {
        var params = {
          params: {
            page: page,
            limit: limit || 10
          }
        };

        $http.get(`${Api.address}users/${roleId}/documents`, params)
          .then((res) => {
            cb(null, res);
          })
          .catch((err) => {
            cb(err);
          });
      };

      return obj;
    }
  ]);
