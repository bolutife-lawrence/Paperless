describe('Alert service',
  () => {

    var Utils;

    beforeEach(module('paperless'));

    beforeEach(inject(function ($injector) {
      Utils = $injector.get('Utils');
    }));

    describe('showBottomSheet method',
      () => {
        it('should be called', () => {
          spyOn(Utils, 'showBottomSheet').and.callThrough();
          Utils.showBottomSheet('click', 'views/create-document.html');
          expect(Utils.showBottomSheet).toHaveBeenCalled();
        });
      });
  });
