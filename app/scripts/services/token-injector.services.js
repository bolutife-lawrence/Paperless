export default angular.module('paperless.services')
  .factory('TokenInjector', ['Token', (Token) => {
    var tokenInjector = {
      request: (config) => {
        var token = JSON.parse(Token.get());
        if (token) {
          config.headers['x-access-token'] = token.token;
        }
        return config;
      }
    };
    return tokenInjector;
  }]);
