describe('Parent documents controller', () => {

  var scope,
    controller,
    Utils = {
      showBottomSheet: (_event, view) => {
        if (_event) {
          return view;
        }
      }
    },
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

  describe('Text hightlight',
  () => {
    it('should filter and highlight text',
    () => {
      var hayStack = 'TDD is beautiful',
      needle = 'TDD',
      result = scope.highlight(needle, hayStack);
      expect(typeof result).toBe('object');
    });

    it('should return text untouched if text to search in is not present ',
    () => {
      var needle = 'TDD',
      result = scope.highlight(needle, null);
      expect(typeof result).toBe('object');
    });

    it('show load up mdBottomSheet',
    () => {
      spyOn(Utils, 'showBottomSheet').and.callThrough();
      scope.loadCreateDocModal();
      expect(Utils.showBottomSheet).toHaveBeenCalled();
    });
  });
});
