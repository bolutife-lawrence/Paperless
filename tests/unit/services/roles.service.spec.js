describe('Roles service', () => {

  var httpBackend,
    Roles,
    result,
    returnedRoles = [{
      _id: '56ccea5c35d0394572cb337a',
      title: 'fellow',
    }, {
      _id: '56cbc9eefe35b3470f8c5c6a',
      title: 'trainer',
    }];

  beforeEach(module('paperless'));

  beforeEach(inject(function ($injector) {
    Roles = $injector.get('Roles');
    httpBackend = $injector.get('$httpBackend');
    httpBackend.whenGET('views/home.html').respond(200, {});
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('role resource', () => {
    describe('#get method', () => {
      it('should get a role', () => {
        httpBackend.expectGET(/\/api\/v0.1\/roles\/(.+)/)
          .respond(200, {
            id: 'j464rj4389734rejgb4874',
            title: 'fellow'
          });

        result = Roles.get({
          id: 'j464rj4389734rejgb4874'
        });

        httpBackend.flush();

        expect(result.title).toBe('fellow');
      });

      it('should fail on 500 server error', () => {
        httpBackend.expectGET(/\/api\/v0.1\/roles\/(.+)/)
          .respond(500, {});

        result = Roles.get({
          id: 'j464rj4389734rejgb4874'
        });

        httpBackend.flush();

        expect(result.title).not.toBeDefined();
      });

      it('should get all roles', () => {
        httpBackend.expectGET(/\/api\/v0.1\/roles/)
          .respond(200, {
            roles: {
              docs: [{
                _id: '56ccea5c35d0394572cb337a',
                title: 'fellow',
              }, {
                _id: '56cbc9eefe35b3470f8c5c6a',
                title: 'trainer',
              }],
              total: 2,
              limit: 20,
              page: 1,
              pages: 1
            }
          });

        result = Roles.get();
        httpBackend.flush();

        expect(result.roles.docs).toEqual(returnedRoles);
        expect(result.roles.total).toBe(2);
        expect(result.roles.limit).toBe(20);
        expect(result.roles.page).toBe(1);
        expect(result.roles.pages).toBe(1);
      });

      it('should fail on 500 server error', () => {
        httpBackend.expectGET(/\/api\/v0.1\/roles/)
          .respond(500, {});

        result = Roles.get();
        httpBackend.flush();

        expect(result.roles).toBeUndefined();
      });
    });

    describe('#save method', () => {
      it('should save a role', () => {
        httpBackend.expectPOST(/\/api\/v0.1\/roles/)
          .respond(200, {
            id: 'j464rj4389734rejgb4874',
            title: 'fellow'
          });

        result = Roles.save();

        httpBackend.flush();

        expect(result.id).toBe('j464rj4389734rejgb4874');
        expect(result.title).toBe('fellow');
      });

      it('should fail on 500 server error', () => {
        httpBackend.expectPOST(/\/api\/v0.1\/roles/)
          .respond(500, {});

        result = Roles.save();
        httpBackend.flush();

        expect(result.id).toBeUndefined();
      });
    });

    describe('#update method', () => {
      it('should update a role', () => {
        httpBackend.expectPUT(/\/api\/v0.1\/roles\/(.+)/)
          .respond(200, {
            title: 'fellow'
          });

        result = Roles.update({
          id: 'j464rj4389734rejgb4874'
        });

        httpBackend.flush();

        expect(result.title).toBe('fellow');
      });

      it('should fail on 500 server error', () => {
        httpBackend.expectPUT(/\/api\/v0.1\/roles\/(.+)/)
          .respond(500, {});

        result = Roles.update({
          id: 'j464rj4389734rejgb4874'
        });

        httpBackend.flush();

        expect(result.title).toBeUndefined();
      });
    });

    describe('#delete method', () => {
      it('should delete a role', () => {
        httpBackend.expectDELETE(/\/api\/v0.1\/roles\/(.+)/)
          .respond(200, {
            deleted: true
          });

        result = Roles.delete({
          id: 'j464rj4389734rejgb4874'
        });

        httpBackend.flush();

        expect(result.deleted).toBe(true);
      });

      it('should fail on 500 server error', () => {
        httpBackend.expectDELETE(/\/api\/v0.1\/roles\/(.+)/)
          .respond(500, {});

        result = Roles.delete({
          id: 'j464rj4389734rejgb4874'
        });

        httpBackend.flush();

        expect(result.deleted).toBeUndefined();
      });
    });
  });
});
