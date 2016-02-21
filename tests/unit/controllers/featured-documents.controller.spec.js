describe('Featured documents controller', () => {

  var scope,
    controller,
    Documents,
    featuredDocs = {
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

    controller = $controller('featuredDocsCtrl', {
      $scope: scope,
      featuredDocs: featuredDocs,
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
        expect(scope.featuredDocs).toBeDefined();
      });
  });
});
