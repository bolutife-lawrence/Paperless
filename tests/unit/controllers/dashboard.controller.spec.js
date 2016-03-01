describe('Dashboard controller', () => {

  var scope,
    controller,
    state,
    currentUser = {
      _id: '56bf95c3d1716d4d9413b805',
      role: [{
        title: 'fellow',
      }]
    },
    Auth,
    mdSidenav,
    httpBackend,
    genMenuItems = [{
      link: 'dashboard.user-documents.own',
      title: 'Documents',
      icon: 'fa fa-th-list'
    }, {
      link: 'dashboard.user-profile',
      title: 'Profile',
      icon: 'fa fa-user'
    }],
    adminMenuItems = [{
      link: 'dashboard.users',
      title: 'Users',
      icon: 'fa fa-th-list'
    }, {
      link: 'dashboard.roles',
      title: 'Roles',
      icon: 'fa fa-th-list'
    }];

  beforeEach(module('paperless'));

  beforeEach(module(function ($provide) {
    mdSidenav = {};
    mdSidenav.toggle = jasmine.createSpy();
    $provide.factory('$mdSidenav', () => {
      return () => {
        return mdSidenav;
      };
    });

  }));

  beforeEach(inject(function ($injector, $controller) {
    scope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.expectGET('views/home.html').respond(200);

    controller = $controller('dashboardCtrl', {
      $scope: scope
    });

    Auth = $injector.get('Auth');
    state = $injector.get('$state');
    scope.currentUser = currentUser;
  }));

  it('should populate menubar with menu items for general users',
    () => {
      scope.init();
      expect(scope.currentUser).toBeDefined();
      expect(scope.menuItems).toBeDefined();
      expect(scope.menuItems).toContain(...genMenuItems);
    });

  it('should populate menubar with menu items for admin users',
    () => {
      scope.currentUser.role[0].title = 'admin';
      scope.init();
      expect(scope.currentUser).toBeDefined();
      expect(scope.menuItems).toBeDefined();
      expect(scope.menuItems).toContain(...adminMenuItems);
    });

  it('should pop up a directive pointing the user to select a role',
    () => {
      spyOn(window, 'swal').and.callThrough();
      scope.currentUser.role = [];
      scope.init();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUser.role.length).toBe(0);
      expect(window.swal).toHaveBeenCalled();
    });

  it('should call toggle method of sidenav',
    () => {
      scope.toggleNav();
      expect(mdSidenav.toggle).toHaveBeenCalled();
    });

  it('should call the logout function in the auth service and' +
    'remove currenr user form the session',
    () => {
      spyOn(Auth, 'logout').and.callThrough();
      spyOn(state, 'go');
      expect(scope.currentUser).toBeDefined();
      scope.logout();
      expect(Auth.logout).toHaveBeenCalled();
      expect(scope.currentUser).not.toBeDefined();
      expect(state.go).toHaveBeenCalled();
    });
});
