describe('Auth Service', () => {

  var Auth,
    Token;

  beforeEach(module('paperless'));

  beforeEach(module(function ($provide) {

    $provide.factory('Token', function () {
      var _token;

      return {
        set: token => {
          _token = token;
        },
        get: () => {
          return _token;
        },
        remove: () => {
          _token = null;
        }
      };
    });
  }));

  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    Token = $injector.get('Token');
  }));

  it('setToken function should be defined and be a function', () => {
    expect(Auth.setToken).toBeDefined();
    expect(typeof Auth.setToken).toBe('function');
  });

  it('setToken should call Token.set', () => {
    spyOn(Auth, 'setToken').and.callThrough();
    spyOn(Token, 'set');
    Auth.setToken('token');
    expect(Auth.setToken).toHaveBeenCalledWith('token');
    expect(Token.set).toHaveBeenCalled();
  });

  it('isLoggedIn function should be defined and be a function', () => {
    expect(Auth.isLoggedIn).toBeDefined();
    expect(typeof Auth.setToken).toBe('function');
  });

  it('isLoggedIn should call Token.get and return true', () => {
    spyOn(Auth, 'isLoggedIn').and.callThrough();
    spyOn(Token, 'get').and.callThrough();
    Auth.setToken('token');
    expect(Auth.isLoggedIn()).toBe(true);
    expect(Auth.isLoggedIn).toHaveBeenCalled();
    expect(Token.get).toHaveBeenCalled();
  });

  it('logout function should be defined and be a function', () => {
    expect(Auth.logout).toBeDefined();
    expect(typeof Auth.logout).toBe('function');
  });

  it('logout should call Token.remove', () => {
    spyOn(Auth, 'logout').and.callThrough();
    spyOn(Token, 'remove');
    Auth.logout();
    expect(Auth.logout).toHaveBeenCalled();
    expect(Token.remove).toHaveBeenCalled();
  });
});
