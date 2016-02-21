describe('Login controller', () => {

  var scope,
    controller,
    state,
    Users = {
      save: (user, cb, cbb) => {
        var _user = {
            success: true,
            user: {
              _id: '56bf95c3d1716d4d9413b805',
              name: {
                first: 'john',
                last: 'Doe'
              },
              email: 'jonny@gmail.com'
            },
            token: '90'
          },

          err = {
            data: {
              message: 'You were not logged in'
            }
          };

        if (user) cb(_user);
        else cbb(err);
      }
    },
    Auth,
    httpBackend;

  beforeEach(() => {
    module('paperless');
  });

  beforeEach(inject(($injector, $rootScope, $controller) => {
    scope = $rootScope.$new();
    httpBackend = $injector.get('$httpBackend');
    httpBackend.expectGET('views/home.html').respond(200);

    controller = $controller('signupCtrl', {
      $scope: scope,
      Users: Users
    });
    Auth = $injector.get('Auth');
    state = $injector.get('$state');
  }));

  it('should call the save function in the users service',
    () => {
      spyOn(Users, 'save').and.callThrough();
      spyOn(Auth, 'setToken');
      spyOn(state, 'go');
      scope.user = true;
      scope.signup();
      expect(Users.save).toBeDefined();
      expect(Users.save).toHaveBeenCalled();
      expect(Auth.setToken).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
      expect(scope.currentUser).toBeDefined();
    });

  it('should call the save function in the users service with an error',
    () => {
      spyOn(Users, 'save').and.callThrough();
      spyOn(Auth, 'setToken');
      spyOn(state, 'go');
      scope.user = false;
      scope.signup();
      expect(Users.save).toBeDefined();
      expect(Users.save).toHaveBeenCalled();
      expect(Auth.setToken).not.toHaveBeenCalled();
      expect(state.go).not.toHaveBeenCalled();
      expect(scope.currentUser).not.toBeDefined();
    });
});
