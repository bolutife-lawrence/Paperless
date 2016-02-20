describe('User profile controller', () => {

  var scope,
    controller,
    state,
    stateParams,
    defaultImgUrl = 'http://res.cloudinary.com/dms/image/upload/c_scale,' +
    'h_275,q_98,r_30/v1453209823/default_avatar_fnm9wb.gif',
    currentUser = {
      _id: '56bf95c3d1716d4d9413b805',
      name: {
        last: 'Jonny',
        first: 'frog'
      },
      email: 'jonny_frog@gmail.com',
      role: [{
        _id: '56bf95c3d1716d4d9413b805',
        title: 'fellow',
      }],
      google: {
        id: null,
        token: null
      },
      facebook: {
        id: null,
        token: null
      },
      img_public_id: null,
      img_url: defaultImgUrl,
      token: 'kjrebjerogkbje438934869webjbgjk849366869',
      hasErrors: false
    },
    Auth,
    Users,
    Roles,
    ngProgressFactory,
    Avatar,
    $httpBackend;

  beforeEach(module('paperless'));

  beforeEach(module(function ($provide) {
    $provide.factory('Avatar', function () {
      return {
        uploadImage: (file) => {
          var res = {
              data: {
                img_url: 'img_url_has_now_been_changed',
                img_public_id: 'v145398fnf23ghd'
              }
            },

            err = {
              message: 'Image was not uploaded.'
            },

            evt = {
              loaded: 100.0,
              total: 100.0
            };

          return {
            then: (cb, cbb, cbbb) => {
              if (file) {
                cb(res);
                cbbb(evt);
              } else {
                cbb(err);
              }
            }
          };
        },

        removeImage: (imgPublicId) => {
          var res = {
            data: {
              img_url: defaultImgUrl
            }
          };

          return {
            then: (cb, cbb) => {
              if (imgPublicId) {
                cb(res);
              } else {
                cbb();
              }
            }
          };
        }
      };
    });

    $provide.factory('Roles', function () {
      return {
        get: (cb) => {
          return cb({
            roles: {
              docs: [{
                _id: 'j347nndu8473nd848',
                title: 'admin'
              }, {
                _id: 'mfdv498387kjnf0rbf',
                title: 'superadmin'
              }, {
                _id: 'klfn8473em88o9nd848',
                title: 'fellow'
              }, {
                _id: '23kks8302273nd848',
                title: 'trainer'
              }]
            }
          });
        }
      };
    });

    $provide.factory('Users', function () {
      return {
        update: (userId, currentUserInfo, cb, cbb) => {
          var res = {
              user: currentUserInfo
            },

            err = {
              data: {
                message: 'Profile not updated'
              }
            };

          if (!currentUserInfo.hasErrors) {
            cb(res);
          } else {
            cbb(err);
          }
        }
      };
    });

    $provide.factory('Auth', function () {
      var token;

      return {
        setToken: (token) => {
          token = token;
        },

        isLoggedIn: () => {
          return token ? true : false;
        }
      };
    });
  }));

  beforeEach(inject(function ($injector, $controller) {
    scope = $injector.get('$rootScope');
    stateParams = $injector.get('$stateParams');
    ngProgressFactory = $injector.get('ngProgressFactory');
    Users = $injector.get('Users');
    Roles = $injector.get('Roles');
    Auth = $injector.get('Auth');
    state = $injector.get('$state');
    Avatar = $injector.get('Avatar');
    $httpBackend = $injector.get('$httpBackend');

    controller = $controller('userProfileCtrl', {
      $scope: scope,
      $rootScope: scope,
      $stateParams: stateParams,
      $state: state,
      ngProgressFactory: ngProgressFactory,
      Auth: Auth,
      Users: Users,
      Roles: Roles,
      Avatar: Avatar
    });

    scope.currentUser = currentUser;
    scope.init();
  }));

  it('should recieve file object and not set new image url on' +
    ' error during upload',
    () => {
      spyOn(Avatar, 'uploadImage').and.callThrough();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUser.img_url).toBeDefined();
      expect(scope.currentUser.img_public_id).toBe(null);
      expect(scope.imgPublicId).not.toBeDefined();
      scope.changeProfilePic(false);
      expect(Avatar.uploadImage).toHaveBeenCalled();
      expect(scope.currentUser.img_url).toBe(defaultImgUrl);
      expect(scope.currentUser.img_public_id).toBe(null);
      expect(scope.imgPublicId).not.toBeDefined();
    });

  it('should recieve file object and set new image url on successful upload',
    () => {
      spyOn(Avatar, 'uploadImage').and.callThrough();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUser.img_url).toBeDefined();
      expect(scope.currentUser.img_public_id).toBe(null);
      expect(scope.imgPublicId).not.toBeDefined();
      $httpBackend.expectGET('views/welcome.html')
        .respond({
          view: true
        });
      scope.changeProfilePic(true);
      expect(Avatar.uploadImage).toHaveBeenCalled();
      expect(scope.currentUser.img_url).toBe('img_url_has_now_been_changed');
      expect(scope.currentUser.img_public_id).toBe('v145398fnf23ghd');
      expect(scope.imgPublicId).toBeDefined();
    });

  it('should set imgPublicId scope variable if it is set on the current user',
    () => {
      expect(scope.imgPublicId).toBeDefined();
    });

  it('should reset user\'s img_url property if img_public_id is set',
    () => {
      scope.imgPublicId = 'jdbferkjb99';
      scope.currentUser.img_public_id = 'jdbferkjb99';
      spyOn(Avatar, 'removeImage').and.callThrough();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUser.img_url).toBeDefined();
      expect(scope.currentUser.img_public_id).toBe('jdbferkjb99');
      expect(scope.imgPublicId).toBeDefined();
      $httpBackend.expectGET('views/welcome.html')
        .respond({
          view: true
        });
      scope.removeProfilePic(true);
      expect(Avatar.removeImage).toHaveBeenCalled();
      expect(scope.currentUser.img_url).toBe(defaultImgUrl);
      expect(scope.currentUser.img_public_id).toBe(null);
      expect(scope.imgPublicId).toBe(null);
    });

  it('should not reset user\'s img_url property on error',
    () => {
      scope.imgPublicId = 'jdbferkjb99';
      scope.currentUser.img_public_id = 'jdbferkjb99';
      spyOn(Avatar, 'removeImage').and.callThrough();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUser.img_url).toBeDefined();
      expect(scope.currentUser.img_public_id).toBe('jdbferkjb99');
      expect(scope.imgPublicId).toBeDefined();
      scope.removeProfilePic(false);
      expect(Avatar.removeImage).toHaveBeenCalled();
      expect(scope.currentUser.img_url).toBe(defaultImgUrl);
      expect(scope.currentUser.img_public_id).toBe('jdbferkjb99');
      expect(scope.imgPublicId).toBe('jdbferkjb99');
    });

  it('should populate scope view with roles',
    () => {
      spyOn(Roles, 'get').and.callThrough();
      scope.loadRoles();
      expect(Roles.get).toHaveBeenCalled();
      expect(scope.roles).toBeDefined();
      expect(scope.roles).toEqual(jasmine.any(Array));
    });

  it('should load roles without superadmin and admin roles included',
    () => {
      spyOn(Roles, 'get').and.callThrough();
      scope.loadRoles();
      expect(Roles.get).toHaveBeenCalled();
      expect(scope.roles).not.toContain(jasmine.objectContaining({
        _id: 'j347nndu8473nd848',
        title: 'admin'
      }));
      expect(scope.roles).not.toContain(jasmine.objectContaining({
        _id: 'mfdv498387kjnf0rbf',
        title: 'superadmin'
      }));
    });

  it('should update the current user\'s data',
    () => {
      spyOn(Users, 'update').and.callThrough();
      spyOn(Auth, 'setToken');
      stateParams.id = '56bf95c3d1716d4d9413b805';
      scope.currentUser = currentUser;
      scope.updateUser();
      expect(Users.update).toHaveBeenCalled();
      expect(Auth.setToken).toHaveBeenCalled();
    });

    it('should not update the current user\'s data',
      () => {
        spyOn(Users, 'update').and.callThrough();
        spyOn(Auth, 'setToken');
        stateParams.id = '56bf95c3d1716d4d9413b805';
        scope.currentUser.hasErrors = true;
        scope.currentUser = currentUser;
        scope.updateUser();
        expect(Users.update).toHaveBeenCalled();
        expect(Auth.setToken).not.toHaveBeenCalled();
      });

  it('showPasswordFields and resetPassword should be defined',
    () => {
      expect(scope.showPasswordFields).toBeDefined();
      expect(scope.resetPassword).toBeDefined();
    });

  it('should hide password fields by default',
    () => {
      expect(scope.resetPassword).toBe(false);
    });

  it('should display password fields',
    () => {
      scope.showPasswordFields();
      expect(scope.resetPassword).toBe(true);
    });

  it('should hide password fields if scope.resetPassword is true',
    () => {
      scope.resetPassword = true;
      scope.showPasswordFields();
      expect(scope.resetPassword).toBe(false);
    });
});
