describe('Alert service',
  () => {

    var Alert,
      config = {
        title: 'Title',
        text: 'text',
        type: 'success',
        showConfirmButton: false,
        timer: 2000
      },
      _config = {
        title: 'Are you sure?',
        text: 'You will not be able to undo this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, do it!',
        closeOnConfirm: false
      };

    beforeEach(module('paperless'));
    beforeEach(inject(function ($injector) {
      Alert = $injector.get('Alert');
    }));

    describe('show method',
      () => {
        it('should be called', () => {
          spyOn(window, 'swal').and.callThrough();
          Alert.show(config);
          expect(window.swal).toHaveBeenCalledWith(config);
        });
      });

    describe('showWithConfirm method',
      () => {
        it('should be called', () => {
          spyOn(window, 'swal').and.callThrough();
          Alert.showWithConfirm(_config);
          expect(window.swal).toHaveBeenCalledWith(_config);
        });
      });
  });
