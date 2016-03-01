describe('Token injector', () => {
  var Token,
    token = {
      id: 'kljrg9570943',
      token: 'set_token'
    },
    config = {
      headers: {}
    },
    dataStore = {},
    TokenInjector,
    factoryObj = {
      set: (token) => dataStore.token = token,
      get: () => dataStore.token
    };

  beforeEach(module('paperless'));
  beforeEach(module(function ($provide) {
    $provide.factory('Token', () => {
      return factoryObj;
    });
  }));

  beforeEach(inject(function ($injector) {
    Token = $injector.get('Token');
    TokenInjector = $injector.get('TokenInjector');
  }));

  describe('request method', () => {
    it('set call the Token.get method and set token on the headers', () => {
      spyOn(Token, 'get').and.callThrough();
      Token.set(JSON.stringify(token));
      var req = TokenInjector.request(config);
      expect(req.headers['x-access-token']).toBe('set_token');
      expect(Token.get).toHaveBeenCalled();
    });
  });
});
