  describe('Login controller', () => {

    var scope,
      controller,
      state,
      Users = {
        login: (user, cb) => {
          if (user) {
            cb(null, {
              data: {
                success: true,
                user: {
                  _id: '56bf95c3d1716d4d9413b805',
                  name: {
                    first: 'Bolutife',
                    last: 'Lawrence'
                  },
                  email: 'lawrence@gmail.com'
                },
                token: '90'
              }
            });
          } else {
            cb({
              data: {
                success: false,
                message: 'User login failed'
              }
            });
          }
        },
        fbLogin: () => {},
        gLogin: () => {}
      },
      Auth;

    beforeEach(() => {
      module('paperless');
    });

    beforeEach(inject(($injector, $rootScope, $controller) => {
      scope = $rootScope.$new();
      controller = $controller('loginCtrl', {
        $scope: scope,
        Users: Users
      });
      Auth = $injector.get('Auth');
      state = $injector.get('$state');
    }));

    it('should call the login function in the users service',
      () => {
        spyOn(Users, 'login').and.callThrough();
        spyOn(Auth, 'setToken');
        spyOn(state, 'go');
        scope.user = true;
        scope.login();
        expect(Users.login).toBeDefined();
        expect(Users.login).toHaveBeenCalled();
        expect(Auth.setToken).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalled();
        expect(scope.currentUser).toBeDefined();
      });

    it('should call the login function in the users service with an error',
      () => {
        spyOn(Users, 'login').and.callThrough();
        spyOn(Auth, 'setToken');
        spyOn(state, 'go');
        scope.user = false;
        scope.login();
        expect(Users.login).toBeDefined();
        expect(Users.login).toHaveBeenCalled();
        expect(Auth.setToken).not.toHaveBeenCalled();
        expect(state.go).not.toHaveBeenCalled();
        expect(scope.currentUser).not.toBeDefined();
      });

    it('should call the facebook login function in the users service',
      () => {
        spyOn(Users, 'fbLogin').and.callThrough();
        scope.fbLogin();
        expect(Users.fbLogin).toBeDefined();
        expect(Users.fbLogin).toHaveBeenCalled();
      });

    it('should call the google login function in the users service',
      () => {
        spyOn(Users, 'gLogin').and.callThrough();
        scope.googleLogin();
        expect(Users.gLogin).toBeDefined();
        expect(Users.gLogin).toHaveBeenCalled();
      });
  });
