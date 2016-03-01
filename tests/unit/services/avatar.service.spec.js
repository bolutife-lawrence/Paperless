describe('Avatar service', () => {

  var httpBackend,
    Avatar,
    Upload = {
      upload: (data) => {
        return data;
      }
    },
    file = {
      size: 3406,
      mimetype: 'image/jpeg',
      path: 'images/upload/test.jpeg'
    },
    imgId = 'jefheji894';

  beforeEach(module('paperless'));
  beforeEach(module(function ($provide) {
    $provide.factory('Upload', () => {
      return Upload;
    });
  }));

  beforeEach(inject(function ($injector) {
    Avatar = $injector.get('Avatar');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.whenGET('views/home.html').respond(200, {});
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('uploadImage method', () => {
    it('should call the upload method of the Upload service', () => {
      spyOn(Upload, 'upload').and.callThrough();
      Avatar.uploadImage(file);
      httpBackend.flush();
      expect(Upload.upload).toHaveBeenCalled();
    });
  });

  describe('uploadImage method', () => {
    it('should make a delete request', () => {
      httpBackend.expectDELETE(/\/api\/v0.1\/images\/(.+)/).respond(200, {
        delete: true
      });

      Avatar.removeImage(imgId);
      httpBackend.flush();
    });
  });
});
