describe('Social auth', () => {
  var Users,
    $window,
    httpBackend,
    dataStore = {},
    windowObj = {
      location: {
        href: null
      },
      localStorage: {
        setItem: (getter, setToken) => dataStore[getter] = setToken,
        getItem: () => dataStore.token,
        removeItem: () => delete dataStore.token
      }
    };

  beforeEach(module('paperless'));

  beforeEach(module(function ($provide) {
    $provide.value('$window', windowObj);
  }));

  beforeEach(inject(function ($injector) {
    Users = $injector.get('Users');
    $window = $injector.get('$window');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.whenGET('views/home.html').respond(200, {});
    httpBackend.whenGET(/\/api\/v0.1\/users\/(.+)/).respond(200, {
      success: true
    });
  }));

  describe('gLogin method', () => {
    it('should be a fucntion', () => {
      expect(typeof Users.gLogin).toBe('function');
    });

    it('should set a url to $window.location.href', () => {
      Users.gLogin();
      expect($window.location.href).toBeDefined();
      expect(typeof $window.location.href).toBe('string');
    });
  });

  describe('fbLogin method', () => {
    it('should be a fucntion', () => {
      expect(typeof Users.fbLogin).toBe('function');
    });

    it('should set a url to $window.location.href', () => {
      Users.fbLogin();
      expect($window.location.href).toBeDefined();
      expect(typeof $window.location.href).toBe('string');
    });
  });
});
