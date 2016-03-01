describe('Alert service',
  () => {

    var Utils,
      $mdBottomSheet;

    beforeEach(module('paperless'));
    beforeEach(inject(function ($injector) {
      Utils = $injector.get('Utils');
      $mdBottomSheet = $injector.get('$mdBottomSheet');
    }));

    describe('showBottomSheet method',
      () => {
        it('should be called', () => {
          spyOn($mdBottomSheet, 'show').and.callThrough();
          Utils.showBottomSheet('click', 'views/create-document.html');
          expect($mdBottomSheet.show).toHaveBeenCalled();
        });
      });
  });
