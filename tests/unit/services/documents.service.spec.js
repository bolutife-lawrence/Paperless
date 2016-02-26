describe('Documents service',
  () => {

    var httpBackend,
      Documents,
      result,
      userDocs,
      featuredDocs,
      successFn,
      errorFn,
      userId = '56ccea5c35d0394572cb337a',
      roleId = '56cbc9eefe35b3470f8c5c6a',
      returnedDocs = [{
        _id: '56ccea5c35d0394572cb337a',
        title: 'TDD is beautiful'
      }, {
        _id: '56cbc9eefe35b3470f8c5c6a',
        title: 'This is da bomb'
      }];

    beforeEach(module('paperless'));

    beforeEach(inject(function ($injector) {
      Documents = $injector.get('Documents');
      httpBackend = $injector.get('$httpBackend');
      httpBackend.whenGET('views/home.html').respond(200, {});
    }));

    afterEach(() => {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    describe('document resource',
      () => {
        describe('#get method',
          () => {
            it('should get a document',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/documents\/(.+)/)
                  .respond(200, {
                    id: 'j464rj4389734rejgb4874',
                    title: 'TDD is beautiful'
                  });

                result = Documents.get({
                  id: 'j464rj4389734rejgb4874'
                });

                httpBackend.flush();
                expect(result.title).toBe('TDD is beautiful');
              });

            it('should fail on 500 server error',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/documents\/(.+)/)
                  .respond(500, {});

                result = Documents.get({
                  id: 'j464rj4389734rejgb4874'
                });

                httpBackend.flush();
                expect(result.title).not.toBeDefined();
              });

            it('should get all documents',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/documents/)
                  .respond(200, {
                    docs: {
                      docs: [{
                        _id: '56ccea5c35d0394572cb337a',
                        title: 'TDD is beautiful'
                      }, {
                        _id: '56cbc9eefe35b3470f8c5c6a',
                        title: 'This is da bomb'
                      }],
                      total: 2,
                      limit: 20,
                      page: 1,
                      pages: 1
                    }
                  });

                result = Documents.get();
                httpBackend.flush();

                expect(result.docs.docs).toEqual(returnedDocs);
                expect(result.docs.total).toBe(2);
                expect(result.docs.limit).toBe(20);
                expect(result.docs.page).toBe(1);
                expect(result.docs.pages).toBe(1);
              });

            it('should fail on 500 server error',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/documents/)
                  .respond(500, {});

                result = Documents.get();
                httpBackend.flush();

                expect(result.docs).toBeUndefined();
              });
          });

        describe('#save method', () => {
          it('should get a document',
            () => {
              httpBackend.expectPOST(/\/api\/v0.1\/documents/)
                .respond(200, {
                  id: 'j464rj4389734rejgb4874',
                  title: 'TDD is beautiful'
                });

              result = Documents.save();
              httpBackend.flush();

              expect(result.id).toBe('j464rj4389734rejgb4874');
              expect(result.title).toBe('TDD is beautiful');
            });

          it('should fail on 500 server error',
            () => {
              httpBackend.expectPOST(/\/api\/v0.1\/documents/)
                .respond(500, {});

              result = Documents.save();
              httpBackend.flush();

              expect(result.id).toBeUndefined();
              expect(result.title).toBeUndefined();
            });
        });

        describe('#update method', () => {
          it('should update a document',
            () => {
              httpBackend.expectPUT(/\/api\/v0.1\/documents\/(.+)/)
                .respond(200, {
                  title: 'TDD is beautiful'
                });

              result = Documents.update({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.title).toBe('TDD is beautiful');
            });

          it('should fail on 500 server error',
            () => {
              httpBackend.expectPUT(/\/api\/v0.1\/documents\/(.+)/)
                .respond(500, {});

              result = Documents.update({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.title).toBeUndefined();
            });
        });

        describe('#delete method', () => {
          it('should delete a user instance',
            () => {
              httpBackend.expectDELETE(/\/api\/v0.1\/documents\/(.+)/)
                .respond(200, {
                  deleted: true
                });

              result = Documents.delete({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.deleted).toBe(true);
            });

          it('should fail on 500 server error',
            () => {
              httpBackend.expectDELETE(/\/api\/v0.1\/documents\/(.+)/)
                .respond(500, {});

              result = Documents.delete({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.deleted).toBeUndefined();
            });
        });
      });

    describe('userDocs method', () => {
      it('should retrive users\' documents',
        () => {
          httpBackend.expectGET(/\/api\/v0.1\/users\/(.+)\/documents/)
            .respond(200, {
              docs: returnedDocs
            });

          successFn = (err, res) => userDocs = res.data;

          Documents.userDocs(userId, 1, 5, successFn);

          httpBackend.flush();

          expect(userDocs).toEqual(jasmine.any(Object));
        });

      it('should fail',
        () => {
          httpBackend.expectGET(/\/api\/v0.1\/users\/(.+)\/documents/)
            .respond(500, {
              docs: null
            });

          errorFn = (err) => userDocs = err.data.docs;

          Documents.userDocs(userId, 1, 5, errorFn);

          httpBackend.flush();

          expect(userDocs).toBe(null);
        });
    });

    describe('featuredDocs method', () => {
      it('should retrive users\' featured ocuments',
        () => {
          httpBackend.expectGET(/\/api\/v0.1\/users\/(.+)\/documents/)
            .respond(200, {
              docs: returnedDocs
            });

          successFn = (err, res) => featuredDocs = res.data;

          Documents.featuredDocs(roleId, 1, 5, successFn);

          httpBackend.flush();

          expect(featuredDocs).toEqual(jasmine.any(Object));
        });

      it('should fail on 500 server error',
        () => {
          httpBackend.expectGET(/\/api\/v0.1\/users\/(.+)\/documents/)
            .respond(500, {
              docs: null
            });

          errorFn = (err) => featuredDocs = err.data.docs;

          Documents.featuredDocs(roleId, 1, 5, errorFn);

          httpBackend.flush();

          expect(featuredDocs).toBe(null);
        });
    });
  });
