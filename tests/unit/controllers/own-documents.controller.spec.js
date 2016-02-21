describe('Own documents controller', () => {

  var scope,
    controller,
    Documents,
    ownDocs = {
      data: {
        docs: {
          docs: [],
          pages: 1
        }
      }
    },
    httpBackend;

  beforeEach(module('paperless'));

  beforeEach(inject(function ($injector, $controller) {
    scope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.expectGET('views/home.html').respond(200);

    controller = $controller('ownDocsCtrl', {
      $scope: scope,
      ownDocs: ownDocs,
      Documents: Documents
    });

    scope.init();
  }));

  describe('init function', () => {
    it('should set default values',
      () => {
        expect(scope.noDocsMsg).toBeDefined();
        expect(scope.nextPage).toBeDefined();
        expect(scope.maxPage).toBeDefined();
        expect(scope.ownDocs).toBeDefined();
      });
  });
});
