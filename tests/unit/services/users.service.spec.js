describe('Users service',
  () => {

    var httpBackend,
      Users,
      result,
      rootScope,
      successFn,
      errorFn,
      featuredUsers,
      roleIds = '\'56ccea5c35d0394572cb337a\', \'56cbc9eefe35b3470f8c5c6a\'',
      returnedUsers = [{
        _id: '56ccea5c35d0394572cb337a',
        email: 'jonny@ymail.com',
      }, {
        _id: '56cbc9eefe35b3470f8c5c6a',
        email: 'lawrence.mcbhee@gmail.com',
      }];

    beforeEach(module('paperless'));

    beforeEach(inject(function ($injector) {
      Users = $injector.get('Users');
      rootScope = $injector.get('$rootScope');
      httpBackend = $injector.get('$httpBackend');
      httpBackend.whenGET('views/home.html').respond(200, {});
      httpBackend.whenGET(/\/api\/v0.1\/auth\/facebook/).respond(200, {});
      httpBackend.whenGET(/\/api\/v0.1\/auth\/google/).respond(200, {});
    }));

    afterEach(() => {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    describe('user resource',
      () => {
        describe('#get method',
          () => {
            it('should get a user instance',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/users\/(.+)/)
                  .respond(200, {
                    id: 'j464rj4389734rejgb4874',
                    email: 'you_smart@gmail.com'
                  });

                result = Users.get({
                  id: 'j464rj4389734rejgb4874'
                });

                httpBackend.flush();
                expect(result.email).toBe('you_smart@gmail.com');
              });

            it('should fail on 500 server error',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/users\/(.+)/)
                  .respond(500, {});

                result = Users.get({
                  id: 'j464rj4389734rejgb4874'
                });

                httpBackend.flush();
                expect(result.email).not.toBeDefined();
              });

            it('should get all users',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/users/)
                  .respond(200, {
                    users: {
                      docs: [{
                        _id: '56ccea5c35d0394572cb337a',
                        email: 'jonny@ymail.com',
                      }, {
                        _id: '56cbc9eefe35b3470f8c5c6a',
                        email: 'lawrence.mcbhee@gmail.com',
                      }],
                      total: 2,
                      limit: 20,
                      page: 1,
                      pages: 1
                    }
                  });

                result = Users.get();
                httpBackend.flush();

                expect(result.users.docs).toEqual(returnedUsers);
                expect(result.users.total).toBe(2);
                expect(result.users.limit).toBe(20);
                expect(result.users.page).toBe(1);
                expect(result.users.pages).toBe(1);
              });

            it('should fail on 500 server error',
              () => {
                httpBackend.expectGET(/\/api\/v0.1\/users/)
                  .respond(500, {});

                result = Users.get();
                httpBackend.flush();

                expect(result.users).toBeUndefined();
              });
          });

        describe('#save method', () => {
          it('should get a user instance',
            () => {
              httpBackend.expectPOST(/\/api\/v0.1\/users/)
                .respond(200, {
                  id: 'j464rj4389734rejgb4874',
                  email: 'you_smart@gmail.com'
                });

              result = Users.save();
              httpBackend.flush();

              expect(result.id).toBe('j464rj4389734rejgb4874');
              expect(result.email).toBe('you_smart@gmail.com');
            });

          it('should fail on 500 server error',
            () => {
              httpBackend.expectPOST(/\/api\/v0.1\/users/)
                .respond(500, {});

              result = Users.save();
              httpBackend.flush();

              expect(result.id).toBeUndefined();
              expect(result.email).toBeUndefined();
            });
        });

        describe('#update method', () => {
          it('should update a user instance',
            () => {
              httpBackend.expectPUT(/\/api\/v0.1\/users\/(.+)/)
                .respond(200, {
                  email: 'new_you_smart@gmail.com'
                });

              result = Users.update({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.email).toBe('new_you_smart@gmail.com');
            });

          it('should fail on 500 server error',
            () => {
              httpBackend.expectPUT(/\/api\/v0.1\/users\/(.+)/)
                .respond(500, {
                  email: 'new_you_smart@gmail.com'
                });

              result = Users.update({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.email).toBeUndefined();
            });
        });

        describe('#delete method', () => {
          it('should delete a user instance',
            () => {
              httpBackend.expectDELETE(/\/api\/v0.1\/users\/(.+)/)
                .respond(200, {
                  deleted: true
                });

              result = Users.delete({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.deleted).toBe(true);
            });

          it('should fail on 500 server error',
            () => {
              httpBackend.expectDELETE(/\/api\/v0.1\/users\/(.+)/)
                .respond(500, {});

              result = Users.delete({
                id: 'j464rj4389734rejgb4874'
              });

              httpBackend.flush();

              expect(result.deleted).toBeUndefined();
            });
        });
      });

    describe('login method', () => {
      it('should authenticate',
        () => {
          httpBackend.expectPOST(/\/api\/v0.1\/auth\/authenticate/)
            .respond(200, {
              loggedIn: true
            });

          successFn = (err, res) => rootScope.currentUser = res;

          Users.login({
            email: 'lawrence@gmail.com',
            password: 'funky'
          }, successFn);

          httpBackend.flush();

          expect(rootScope.currentUser).toEqual(jasmine.any(Object));
        });

      it('should fail on authentication',
        () => {
          httpBackend.expectPOST(/\/api\/v0.1\/auth\/authenticate/)
            .respond(500, {
              loggedIn: false
            });

          errorFn = () => rootScope.currentUser = null;

          Users.login({
            email: 'lawrence@gmail.com',
            password: 'funky'
          }, errorFn);

          httpBackend.flush();

          expect(rootScope.currentUser).toBe(null);
        });
    });

    describe('featuredUsers method', () => {
      it('should retrive featured users',
        () => {
          httpBackend.expectGET(/\/api\/v0.1\/users\/featured\?(.+)/)
            .respond(200, {
              users: returnedUsers
            });

          successFn = (err, res) => featuredUsers = res;

          Users.featuredUsers({
            roles: roleIds
          }, successFn);

          httpBackend.flush();

          expect(featuredUsers).toEqual(jasmine.any(Object));
        });

      it('should fail on authentication',
        () => {
          httpBackend.expectGET(/\/api\/v0.1\/users\/featured\?(.+)/)
            .respond(500, {
              users: null
            });

          errorFn = () => featuredUsers = null;

          Users.featuredUsers({
            roles: roleIds
          }, errorFn);

          httpBackend.flush();

          expect(featuredUsers).toBe(null);
        });
    });

    describe('login test', function(){
      beforeEach(function () {
        var $window = {location: {reload: function(){}}};

        module(function($provide) {
          $provide.value('$window', $window);
        });
    });
      describe('',
      () => {
        describe('fbLogin method',
          () => {

            beforeEach(() => {
              httpBackend.flush();
              Users.fbLogin();
            });

            it('should be called', () => {});
          });

        describe('gLogin method',
          () => {

            beforeEach(() => {
              Users.gLogin();
            });

            it('should be called', () => {});
          });
      });

    });
  });
