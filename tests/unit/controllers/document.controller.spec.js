describe('Document controller', () => {

  var scope,
    rootScope,
    controller,
    currentUser = {
      _id: '56bf95c3d1716d4d9413b805',
      role: [{
        _id: '56bf95c3d1716d4d9413b678',
        title: 'fellow',
      }]
    },
    mockDoc = {
      title: 'TDD is beautiful',
      content: 'Developers should learn to do TDD the right way'
    },
    selectedRoles = [{
      _id: '56bf95c3d1716d4d9413b678',
      title: 'fellow'
    }, {
      _id: '56bf95c3d1716d4d9413bss3',
      title: 'trainer'
    }, {
      _id: '56bf95c3d1716d4d9413bpp0',
      title: 'rubyist'
    }],
    confidentialRoles = [{
      _id: '56bf95c3d1716d4d9413hh51',
      title: 'admin'
    }, {
      _id: '56bf95c3d1716d4d94155890',
      title: 'superadmin'
    }],
    Documents = {
      get: (docId, cb) => {
        var res = {
          success: true,
          doc: {
            title: 'TDD is beautiful',
            content: 'Developers should learn to do TDD the right way',
            roles: [{
              _id: '56bf95c3d1716d4d9413b678',
              title: 'fellow'
            }, {
              _id: '56bf95c3d1716d4d9413bss3',
              title: 'trainer'
            }, {
              _id: '56bf95c3d1716d4d9413bpp0',
              title: 'rubyist'
            }],
            userId: [{
              _id: '56bf95c3d1716d4d9413b805'
            }]
          }
        };

        cb(res);
      },

      save: (newDoc, cb, cbb) => {
        var err = {
          data: {
            message: 'Document was not created'
          }
        };

        if (!newDoc.hasErrors) {
          cb();
        } else {
          cbb(err);
        }
      },

      update: (docId, docDetails, cb, cbb) => {
        var err = {
          data: {
            message: 'Document was not updated'
          }
        };

        if (docId && !docDetails.hasErrors) {
          cb();
        } else {
          cbb(err);
        }
      },

      delete: (docIdObj, cb, cbb) => {
        var err = {
          data: {
            message: 'Document was not deleted'
          }
        };

        if (docIdObj.id) {
          cb();
        } else {
          cbb(err);
        }
      }
    },
    Users = {
      featuredUsers: (roles, cb) => {
        var users = {
          data: {
            users: {
              docs: [{
                _id: '56bf95c3d1716d4d9413b222',
                role: [{
                  _id: '56bf95c3d1716d4d9413b678',
                  title: 'fellow',
                }],
                name: {
                  last: 'Florence',
                  first: 'Esther'
                },
                email: 'florence-e@gmail.com'
              }, {
                _id: '56bf95c3d1716d4d9413bi89',
                role: [{
                  _id: '56bf95c3d1716d4d9413bss3',
                  title: 'trianer',
                }],
                name: {
                  last: 'Makee',
                  first: 'winans'
                },
                email: 'makee_winans@yahoo.com'
              }, {
                _id: '56bf95c3d1716d4d9413b904',
                role: [{
                  _id: '56bf95c3d1716d4d9413b678',
                  title: 'fellow',
                }],
                name: {
                  last: 'Uzo',
                  first: 'Awili'
                },
                email: 'awili_uzo@yahoo.com'
              }, {
                _id: '56bf95c3d1716d4d9413b68g',
                role: [{
                  _id: '56bf95c3d1716d4d9413b78o',
                  title: 'pythonista',
                }],
                name: {
                  last: 'Gentle',
                  first: 'Fella'
                },
                email: 'Gentle-g@ymail.com'
              }]
            }
          }
        };

        cb(null, users);
      }
    },

    Roles = {
      get: (cb) => {
        var res = {
          roles: {
            docs: [{
              _id: '56bf95c3d1716d4d9413b678',
              title: 'fellow'
            }, {
              _id: '56bf95c3d1716d4d9413bss3',
              title: 'trainer'
            }, {
              _id: '56bf95c3d1716d4d9413bpp0',
              title: 'rubyist'
            }, {
              _id: '56bf95c3d1716d4d9413hh51',
              title: 'admin'
            }, {
              _id: '56bf95c3d1716d4d94155890',
              title: 'superadmin'
            }]
          }
        };

        cb(res);
      }
    },
    httpBackend,
    stateParams,
    state = {
      go: (stateName, stateDetails) => {
        if (stateName && stateDetails) {
          return true;
        }
      }
    },
    Alert = {
      show: config => {
        if (config) {
          return true;
        }
      },

      showWithConfirm: (config, cb) => {
        if (config) {
          cb();
        }
      }
    },
    mdBottomSheet,
    roles = ['fellow', 'trainer', 'rubyist'],
    Utils = {
      showBottomSheet: (_event, view) => {
        if (_event) {
          return view;
        }
      }
    },
    timeOut;

  beforeEach(module('paperless'));

  beforeEach(inject(function ($injector, $controller) {
    rootScope = $injector.get('$rootScope');
    scope = rootScope.$new();
    httpBackend = $injector.get('$httpBackend');
    mdBottomSheet = $injector.get('$mdBottomSheet');
    stateParams = $injector.get('$stateParams');
    timeOut = $injector.get('$timeout');
    httpBackend.expectGET('views/home.html').respond(200);

    controller = $controller('docCtrl', {
      $scope: scope,
      $rootScope: rootScope,
      $state: state,
      $stateParams: stateParams,
      $mdBottomSheet: mdBottomSheet,
      $timeout: timeOut,
      Users: Users,
      Alert: Alert,
      Roles: Roles,
      Documents: Documents,
      Utils: Utils
    });

    rootScope.currentUser = currentUser;
  }));

  describe('init function',
    () => {

      beforeEach(() => {
        spyOn(scope, 'getDoc').and.callThrough();
        spyOn(scope, 'getFeaturedUsers').and.callThrough();
        spyOn(scope, 'getSelectedRoles').and.callThrough();
        spyOn(scope, 'getDocOwner').and.callThrough();
        scope.init();
      });

      it('should set defualt values',
        () => {
          expect(scope.hidden).toBe(false);
          expect(scope.isOpen).toBe(false);
          expect(scope.hover).toBe(false);
          expect(scope.noFeaturedUsersMsg).toBe('None for now');
          expect(scope.menuItems).toEqual(jasmine.any(Array));
        });

      it('should trigger the getDoc function',
        () => {
          expect(scope.viewDoc).toBeDefined();
          expect(scope.selectedRoles).toBeDefined();
          expect(scope.docOwner).toBe('You');
          expect(scope.getDoc).toHaveBeenCalled();
          expect(scope.getFeaturedUsers).toHaveBeenCalled();
          expect(scope.getSelectedRoles).toHaveBeenCalled();
          expect(scope.getDocOwner).toHaveBeenCalled();
        });
    });

  describe('createDoc function',
    () => {

      beforeEach(() => {
        mockDoc.hasErrors = false;
        scope.newDoc = mockDoc;
      });

      it('should trigger the save method in the Documents service',
        () => {
          scope.selectedRoles = selectedRoles;
          spyOn(Documents, 'save').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(mdBottomSheet, 'hide').and.callThrough();
          spyOn(Alert, 'show').and.callThrough();
          scope.createDoc();
          expect(Documents.save).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalled();
          expect(mdBottomSheet.hide).toHaveBeenCalled();
          expect(Alert.show).toHaveBeenCalled();
        });

      it('should pop up an alert box if no role is selected',
        () => {
          scope.selectedRoles = [];
          spyOn(Documents, 'save').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(mdBottomSheet, 'hide').and.callThrough();
          spyOn(Alert, 'show').and.callThrough();
          scope.createDoc();
          expect(Alert.show).toHaveBeenCalled();
          expect(Documents.save).not.toHaveBeenCalled();
          expect(state.go).not.toHaveBeenCalled();
          expect(mdBottomSheet.hide).not.toHaveBeenCalled();
        });

      it('should pop up an alert box with an error message' +
        ' if doc was not created',
        () => {
          mockDoc.hasErrors = true;
          scope.selectedRoles = selectedRoles;
          spyOn(Documents, 'save').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(mdBottomSheet, 'hide').and.callThrough();
          spyOn(Alert, 'show').and.callThrough();
          scope.createDoc();
          expect(Alert.show).toHaveBeenCalled();
          expect(Documents.save).toHaveBeenCalled();
          expect(state.go).not.toHaveBeenCalled();
          expect(mdBottomSheet.hide).not.toHaveBeenCalled();
        });
    });

  describe('updateDoc function',
    () => {

      beforeEach(() => {
        stateParams.doc_id = '56bf95c3d1716d4d941356hj';
        mockDoc.hasErrors = false;
        scope.viewDoc = mockDoc;
      });

      it('should trigger the update method in the Documents service',
        () => {
          scope.selectedRoles = selectedRoles;
          spyOn(Documents, 'update').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(mdBottomSheet, 'hide').and.callThrough();
          spyOn(Alert, 'show').and.callThrough();
          scope.updateDoc();
          expect(Documents.update).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalled();
          expect(mdBottomSheet.hide).toHaveBeenCalled();
          expect(Alert.show).toHaveBeenCalled();
        });

      it('should pop up an alert box if no role is selected',
        () => {
          scope.selectedRoles = [];
          spyOn(Documents, 'update').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(mdBottomSheet, 'hide').and.callThrough();
          spyOn(Alert, 'show').and.callThrough();
          scope.updateDoc();
          expect(Alert.show).toHaveBeenCalled();
          expect(Documents.update).not.toHaveBeenCalled();
          expect(state.go).not.toHaveBeenCalled();
          expect(mdBottomSheet.hide).not.toHaveBeenCalled();
        });

      it('should pop up an alert box with an error message' +
        ' if doc was not updated',
        () => {
          mockDoc.hasErrors = true;
          scope.selectedRoles = selectedRoles;
          spyOn(Documents, 'update').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(mdBottomSheet, 'hide').and.callThrough();
          spyOn(Alert, 'show').and.callThrough();
          scope.updateDoc();
          expect(Documents.update).toHaveBeenCalled();
          expect(Alert.show).toHaveBeenCalled();
          expect(state.go).not.toHaveBeenCalled();
          expect(mdBottomSheet.hide).not.toHaveBeenCalled();
        });
    });

  describe('hasPrivilege function',
    () => {

      beforeEach(() => {
        mockDoc.userId = [{
          _id: '56bf95c3d1716d4d9413b805'
        }];
        scope.viewDoc = mockDoc;
      });

      it('should return a boolean value (true)',
        () => {
          expect(scope.hasPrivilege()).toBe(true);
        });

      it('should return a boolean value (false)',
        () => {
          scope.viewDoc.userId[0]._id = '56bf95c3d171jkfb478489';
          expect(scope.hasPrivilege()).toBe(false);
        });
    });

  describe('initSelectedRoles function',
    () => {
      it('should initialize an empty array',
        () => {
          scope.initSelectedRoles();
          expect(scope.selectedRoles).toBeDefined();
          expect(scope.selectedRoles).toEqual(jasmine.any(Array));
          expect(scope.selectedRoles.length).toBe(0);
        });
    });

  describe('callFunction function',
    () => {
      it('should invoke a function within the scope',
        () => {
          scope.callMe = () => {
            return true;
          };

          spyOn(scope, 'callMe').and.callThrough();
          scope.callFunction('callMe');
          expect(scope.callMe).toHaveBeenCalled();
        });
    });

  describe('toggle function',
    () => {
      var list,
        item;

      beforeEach(() => {
        list = ['1', '2', '3', '4', '5'];
      });

      it('should remove an item from a list if the item exists already',
        () => {
          item = '4';
          expect(list).toContain(item);
          scope.toggle(item, list);
          expect(list).not.toContain(item);
        });

      it('should insert an item into a list if the item doesn\'t exist',
        () => {
          item = '6';
          expect(list).not.toContain(item);
          scope.toggle(item, list);
          expect(list).toContain(item);
        });
    });

  describe('exists function',
    () => {
      var list,
        item;

      beforeEach(() => {
        list = ['1', '2', '3', '4', '5'];
      });

      it('should return true if item exists in a list',
        () => {
          item = '4';
          expect(scope.exists(item, list)).toBe(true);
        });

      it('should return false if item doesn\'t exist in a list',
        () => {
          item = '6';
          expect(scope.exists(item, list)).toBe(false);
        });
    });

  describe('loadRoles function',
    () => {
      it('should trigger the get method in the Roles service',
        () => {
          spyOn(Roles, 'get').and.callThrough();
          scope.loadRoles();
          expect(Roles.get).toHaveBeenCalled();
          expect(scope.roles).toBeDefined();
        });

      it('should filter out superadmin and admin roles',
        () => {
          scope.loadRoles();
          expect(scope.roles).not.toContain(...confidentialRoles);
        });
    });

  describe('getDocOwner function',
    () => {

      beforeEach(() => {
        rootScope.currentUser = currentUser;
      });

      it('should return \'You\' if currentUserId matches docOwnerId',
        () => {
          mockDoc.userId = [{
            _id: '56bf95c3d1716d4d9413b805',
          }];
          scope.viewDoc = mockDoc;
          scope.getDocOwner();
          expect(scope.docOwner).toBe('You');
        });

      it('should return document\'s owner name if' +
        ' currentUserId does not matche docOwnerId',
        () => {
          mockDoc.userId = [{
            _id: '56bf95c3d1716d4d94fghe573',
            name: {
              last: 'wemme',
              first: 'shawn'
            }
          }];
          scope.viewDoc = mockDoc;
          scope.getDocOwner();
          expect(scope.docOwner).toBe('wemme shawn');
        });
    });

  describe('getSelectedRoles function',
    () => {
      it('should filter through an array of objects' +
        ' and create a new array of strings',
        () => {
          scope.viewDoc = {
            roles: selectedRoles
          };

          scope.getSelectedRoles();
          expect(scope.selectedRoles).toContain(...roles);
        });

      it('terminate the function if there\'s no collection to go through',
        () => {
          scope.viewDoc = {
            roles: []
          };

          scope.getSelectedRoles();
          expect(scope.selectedRoles.length).toBe(0);
        });
    });

  describe('getFeaturedUsers function',
    () => {
      it('should trigger the featuredUsers function in the Users service',
      () => {
        scope.viewDoc = {
          roles: selectedRoles
        };

        scope.getFeaturedUsers();
        expect(scope.featuredUsers.length).toBe(4);
      });
    });

  describe('$watch scope function',
    () => {
      it('should set tooltipVisible property to true if isOpen is true',
        () => {
          scope.isOpen = true;
          scope.$apply('scope.isOpen');
          expect(scope.tooltipVisible).toBe(true);
        });

      it('should set tooltipVisible property to false if isOpen is false',
        () => {
          scope.isOpen = false;
          scope.$apply('scope.isOpen');
          expect(scope.tooltipVisible).toBe(false);
        });
    });

  describe('loadUpdatedDocModal function',
    () => {
      it('trigger the showBottomSheet method in the Utils service', () => {
        spyOn(Utils, 'showBottomSheet').and.callThrough();
        scope.loadUpdatedDocModal();
        expect(Utils.showBottomSheet).toHaveBeenCalled();
      });
    });
});
