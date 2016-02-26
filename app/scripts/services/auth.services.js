export default angular.module('paperless.services')
  .factory('Auth', ['Token', (Token) => {
    return {
      // check if a user's session is still valid
      isLoggedIn: () => Token.get() ? true : false,
      // Tag a specific user to a token
      setToken: (token) => Token.set(token),
      // Destroy token.
      logout: () => Token.remove()
    };
  }]);
