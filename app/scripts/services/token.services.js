angular.module('paperless.services')
  .factory('Token', ['$window', ($window) => {
    return {
      set: token => $window.localStorage.setItem('token', token),
      get: () =>  $window.localStorage.getItem('token'),
      remove: () => $window.localStorage.removeItem('token')
    };
  }]);
