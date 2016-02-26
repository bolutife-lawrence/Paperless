describe('Token service', () => {

  var Token,
    $window,
    localStorage,
    token = {
      id: '4945mfr09t5nefe957',
      token: 'set_token'
    },
    dataStore = {},
    windowObj = {
      localStorage: {
        setItem: (getter, setToken) => dataStore[getter] = setToken,
        getItem: () => dataStore.token,
        removeItem: () => delete dataStore.token
      }
    };

  beforeEach(module('paperless'));

  beforeEach(module(function ($provide) {
    $provide.factory('$window', function () {
      return windowObj;
    });
  }));

  beforeEach(inject(function ($injector) {
    Token = $injector.get('Token');
    $window = $injector.get('$window');
    localStorage = $window.localStorage;
  }));

  describe('set method', () => {
    it('should call $window.localStorage.setItem', () => {
      spyOn(localStorage, 'setItem').and.callThrough();
      Token.set(JSON.stringify(token));
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    it('should call $window.localStorage.getItem', () => {
      spyOn(localStorage, 'getItem').and.callThrough();
      token = Token.get();
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(typeof token).toBe('string');
    });
  });

  describe('remove method', () => {
    it('should call $window.localStorage.removeItem', () => {
      spyOn(localStorage, 'removeItem').and.callThrough();
      Token.remove();
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });
});
