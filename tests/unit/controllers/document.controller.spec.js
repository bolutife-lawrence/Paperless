describe('Document controller', () => {

  var scope,
    controller,
    httpBackend;

  beforeEach(module('paperless'));

  beforeEach(inject(function ($injector, $controller) {
    scope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.expectGET('views/home.html').respond(200);

    controller = $controller('docCtrl', {
      $scope: scope,
    });
  }));
});
