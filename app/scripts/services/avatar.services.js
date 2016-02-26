export default angular.module('paperless.services')
  .factory('Avatar', [
    '$http',
    'Api',
    'Upload', (
      $http,
      Api,
      Upload) => {
        
    return {
      uploadImage: (file) => {
        return Upload.upload({
          url: `${Api.address}image/upload`,
          data: {
            avatar: file,
          }
        });
      },

      removeImage: (imgId) => {
        return $http.delete(`${Api.address}images/${imgId}`);
      }
    };
  }]);
