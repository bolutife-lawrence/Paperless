((angular) => {

  angular.module('paperless.controllers', []);
  angular.module('paperless.services', []);
  angular.module('paperless.filters', []);
  angular.module('paperless.directives', []);

  // Import Controllers
  require('./controllers/login.controllers');
  require('./controllers/home.controllers');
  require('./controllers/signup.controllers');
  require('./controllers/dashboard.controllers');
  require('./controllers/document.controllers');
  require('./controllers/documents.controllers');
  require('./controllers/own-documents.controllers');
  require('./controllers/featured-documents.controllers');
  require('./controllers/user-profile.controllers');

  // Import Services
  require('./services/auth.services');
  require('./services/users.services');
  require('./services/roles.services');
  require('./services/documents.services');
  require('./services/token-injector.services');
  require('./services/token.services');
  require('./services/api.services');
  require('./services/avatar.services');
  require('./services/utils.services');

  // Import filters
  require('./filters/date-time-parser.filters');

  // Import directives
  require('./directives/pw-check.directives');

  const dependencies = [
    'paperless.controllers',
    'paperless.services',
    'paperless.filters',
    'paperless.directives',
    'ui.router',
    'dc.endlessScroll',
    'ngFileUpload',
    'ngProgress',
    'ngResource',
    'ngMaterial',
  ];

  window.app = angular.module('paperless', dependencies);

  window.app.run([
    '$rootScope',
    '$location',
    '$state',
    '$stateParams',
    'Token',
    'Auth',
    'Users', ($rootScope, $location, $state,
      $stateParams, Token, Auth, Users) => {

      // Check if the user's session is valid
      if (Auth.isLoggedIn()) {
        var userSession = JSON.parse(Token.get());
        if (userSession) {
          Users.get({
            id: userSession.id
          }, res => {
            if (res.success) {
              $rootScope.currentUser = res.user;
              $state.go('dashboard.user-documents.own', {
                id: $rootScope.currentUser._id
              });
            }
          });
        }
      }

      $rootScope.$on('$stateChangeSuccess', (ev, to) => {
        if (to.authenticate && !$rootScope.currentUser) {
          $state.go('welcome.login');
        }
      });
    }
  ]);

  window.app.config([
    '$stateProvider',
    '$httpProvider',
    '$urlRouterProvider',
    '$locationProvider', (
      $stateProvider,
      $httpProvider,
      $urlRouterProvider,
      $locationProvider
    ) => {

      $httpProvider.interceptors.push('TokenInjector');

      // Unmatched urls will be redirected automatically to a 404 page
      $urlRouterProvider.otherwise('/404');

      // Now set up the states
      $stateProvider
        .state('welcome', {
          url: '/',
          controller: 'homeCtrl',
          templateUrl: 'views/home.html'
        })
        .state('welcome.login', {
          url: 'users/login',
          views: {
            'login-signup@welcome': {
              controller: 'loginCtrl',
              templateUrl: 'views/login.html'
            },
          }
        })
        .state('welcome.signup', {
          url: 'users/signup',
          views: {
            'login-signup@welcome': {
              controller: 'signupCtrl',
              templateUrl: 'views/signup.html'
            }
          }
        })
        .state('social-auth', {
          url: '/auth/social/success/{id}/?{token}',
          controller: [
            '$stateParams',
            '$rootScope',
            'Auth',
            'Users',
            '$state', ($stateParams, $rootScope, Auth, Users, $state) => {
              var userSession = {
                id: $stateParams.id,
                token: $stateParams.token
              };
              Auth.setToken(JSON.stringify(userSession));
              Users.get({
                id: $stateParams.id,
              }, res => {
                if (res.success) {
                  $rootScope.currentUser = res.user;
                  $state.go('dashboard.user-documents.own', {
                    id: $stateParams.id
                  });
                }
              });
            }
          ]
        })
        .state('dashboard', {
          url: '/dashboard/user/{id}',
          controller: 'dashboardCtrl',
          templateUrl: 'views/dashboard.html',
          authenticate: true
        })
        .state('dashboard.user-profile', {
          url: '/profile',
          views: {
            'dashboard-innner-view@dashboard': {
              controller: 'userProfileCtrl',
              templateUrl: 'views/user-profile.html',
              authenticate: true
            }
          }
        })
        .state('dashboard.user-documents', {
          url: '/documents',
          views: {
            'dashboard-innner-view@dashboard': {
              controller: 'userDocsCtrl',
              templateUrl: 'views/documents.html',
              authenticate: true
            }
          }
        })
        .state('dashboard.user-documents.own', {
          url: '/own?{page}',
          resolve: {
            ownDocs: [
              '$http',
              '$stateParams',
              'Api', ($http, $stateParams, Api) => {
                let url = `${Api.address}users/${$stateParams.id}/documents`;
                return $http.get(url, {
                  params: {
                    page: 1,
                    limit: 10
                  }
                });
              }
            ]
          },
          views: {
            'doc-category@dashboard.user-documents': {
              controller: 'ownDocsCtrl',
              templateUrl: 'views/own-documents.html',
              authenticate: true
            }
          }
        })
        .state('dashboard.user-documents.featured', {
          url: '/featured?{page}',
          resolve: {
            featuredDocs: [
              '$http',
              '$rootScope',
              'Api', ($http, $rootScope, Api) => {
                if ($rootScope.currentUser.role.length > 0) {
                  let roleId = $rootScope.currentUser.role[0]._id,
                    url = `${Api.address}roles/${roleId}/documents`;
                  return $http.get(url, {
                    params: {
                      page: 1,
                      limit: 10
                    }
                  });
                }
              }
            ]
          },
          views: {
            'doc-category@dashboard.user-documents': {
              controller: 'featuredDocsCtrl',
              templateUrl: 'views/featured-documents.html',
              authenticate: true
            }
          }
        })
        .state('dashboard.view-document', {
          url: '/documents/{doc_id}',
          views: {
            'dashboard-innner-view@dashboard': {
              controller: 'docCtrl',
              templateUrl: 'views/view-document.html',
              authenticate: true
            }
          }
        });

      $locationProvider.html5Mode(true);
    }
  ]);
})(angular);
