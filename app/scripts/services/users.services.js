export default angular.module('paperless.services')
  .factory('Users', [
    '$resource',
    '$http',
    '$state',
    '$window',
    'Api', (
      $resource,
      $http,
      $state,
      $window,
      Api) => {
        
      var obj = $resource(`${Api.address}users/:id`, {
        id: '@id'
      }, {
        update: {
          // this method issues a PUT request
          method: 'PUT'
        }
      }, {
        stripTrailingSlashes: false
      });

      obj.login = (user, cb) => {
        $http.post(`${Api.address}auth/authenticate`, user)
          .then((res) => {
            cb(null, res);
          }).catch((err) => {
            cb(err);
          });
      };

      obj.featuredUsers = (roles, cb) => {
        var params = {
          params: {
            limit: 100,
            page: 1,
            roles: roles.toString()
          }
        };
        $http.get(`${Api.address}users/featured`, params)
          .then((users) => {
            cb(null, users);
          })
          .catch((err) => {
            cb(err);
          });
      };

      obj.fbLogin = () => $window.location.href = `${Api.address}auth/facebook`;
      obj.gLogin = () => $window.location.href = `${Api.address}auth/google`;

      return obj;
    }
  ]);
