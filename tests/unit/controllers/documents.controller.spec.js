describe('Parent documents controller', () => {

  var scope,
    controller,
    Utils,
    sce,
    httpBackend;

  beforeEach(module('paperless'));

  beforeEach(inject(function ($injector, $controller) {
    scope = $injector.get('$rootScope');
    sce = $injector.get('$sce');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.expectGET('views/home.html').respond(200);

    controller = $controller('userDocsCtrl', {
      $scope: scope,
      $sce: sce,
      Utils: Utils
    });
  }));
});
