var railsRoutesSet, rangular;

rangular = angular.module('rangular', ["ngResource"]);

railsRoutesSet = {
  index: {
    method: "GET",
    isArray: true
  },
  show: {
    method: "GET"
  },
  "new": {
    method: "GET",
    params: {
      verb: "new"
    }
  },
  create: {
    method: "POST"
  },
  edit: {
    method: "GET",
    params: {
      verb: "edit"
    }
  },
  update: {
    method: "PUT"
  },
  destroy: {
    method: "DELETE"
  },
  info: {
    method: "GET",
    params: {
      verb: "info"
    }
  }
};

rangular.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  }
]);

rangular.factory("railsResource", [
  "$resource", function($resource) {
    return $resource("/:controller/:id/:verb", {
      id: '@id'
    }, railsRoutesSet);
  }
]);

rangular.directive('raController', [
  "railsResource", function(railsResource) {
    return function(scope, element, attrs) {
      var callShowAndEdit, rctrl;
      rctrl = attrs.raController;
      scope[rctrl] = {};
      scope[rctrl].query = attrs.raQuery === void 0 ? {} : eval('(' + attrs.raQuery + ')');
      scope[rctrl].query.controller = rctrl;

      // [query], [success, [failure]]
      processArgs = function() {
        rargs = ({query:null, success:null, failure:null});
        args = arguments[0]

        if (args[0]  !== undefined) {
          if (Object.prototype.toString.call(args[0]) == "[object Function]") {
            rargs.success = args[0];
          } else {
            rargs.query = args[0];
          }
          if (args[1]  !== undefined) {
            if (Object.prototype.toString.call(args[1]) == "[object Function]") {
              if (!!rargs.success) {
                rargs.failure = args[1];
              } else {
                rargs.success = args[1];
              }
            }
            if (args[2]  !== undefined) {
              if (Object.prototype.toString.call(args[2]) == "[object Function]") {
                if (!!!rargs.failure) {
                  rargs.failure = args[2];
                }
              }
            }
          }
        }
        return rargs;
      };

      scope[rctrl].callIndex = function() {
        scope.indexRargs = processArgs(arguments);

        scope[rctrl].indexLoading = true;
        if (scope.indexRargs.query == null) {
          scope.indexRargs.query = scope[rctrl].query;
        }
        scope.indexRargs.query.id = null;
        scope[rctrl].index = railsResource.index(scope.indexRargs.query, function() {
          scope.$broadcast(rctrl + '.index ready');
          if(scope.indexRargs.success) {
            scope.indexRargs.success();
          }
          scope.indexRargs = null;
          scope[rctrl].indexLoading = false;
        }, function() {
          scope.$broadcast(rctrl + '.index error');
          if(scope.indexRargs.failure) {
            scope.indexRargs.failure();
          }
          scope.indexRargs = null;
          scope[rctrl].indexLoading = false;
        });
      };

      callShowAndEdit = function() {
        rargs = processArgs(arguments);

        if (rargs.query == null) {
          rargs.query = scope[rctrl].query;
        }
        scope[rctrl].callShow(rargs.query);
        scope[rctrl].callEdit(rargs.query);
      };


      scope[rctrl].callShow = function() {
        scope.showRargs = processArgs(arguments);

        if (scope.showRargs.query == null) {
          scope.showRargs.query = scope[rctrl].query;
        }
        if (!!scope[rctrl].id) {
          scope.showRargs.query.id = scope[rctrl].id;
          scope[rctrl].show = railsResource.show(scope.showRargs.query, function() {
            scope[rctrl].showLoading = false;
            scope.$broadcast(rctrl + '.show ready');
          }, function() {
            scope[rctrl].showLoading = false;
          });
          scope.showRargs = null;
          scope[rctrl].showLoading = true;
        } else {
          scope[rctrl].show = null;
          scope.$broadcast(rctrl + '.show error');
          scope.showRargs = null;
          scope[rctrl].showLoading = false;
        }
      };

      scope[rctrl].callNew = function() {
        scope.newRargs = processArgs(arguments);

        scope[rctrl].newLoading = true;
        if (scope.newRargs.query == null) {
          scope.newRargs.query = scope[rctrl].query;
        }
        if (!!!scope.newRargs.query.controller) {
          scope.newRargs.query.controller = rctrl;
        }
        scope[rctrl]["new"] = railsResource["new"](scope.newRargs.query, function() {
          scope[rctrl].createError = null;
          scope.$broadcast(rctrl + '.new ready');
          scope.newRargs = null;
          scope[rctrl].newLoading = false;
        }, function() {
          scope.$broadcast(rctrl + '.new error');
          scope.newRargs = null;
          scope[rctrl].newLoading = false;
        });
      };

      scope[rctrl].callEdit = function() {
        scope.editRargs = processArgs(arguments);

        if (scope.editRargs.query == null) {
          scope.editRargs.query = scope[rctrl].query;
        }
        if (!!!scope.editRargs.query.controller) {
          scope.editRargs.query.controller = rctrl;
        }
        if (!!scope[rctrl].id) {
          scope[rctrl].editLoading = true;
          scope.editRargs.query.id = scope[rctrl].id;
          scope[rctrl].edit = railsResource.edit(scope.editRargs.query, function() {
            scope[rctrl].updateError = null;
            scope[rctrl].editLoading = false;
            scope.$broadcast(rctrl + '.edit ready');
          }, function() {
            scope.$broadcast(rctrl + '.edit error');
          });
          scope.editRargs = null;
        } else {
          scope[rctrl].editLoading = false;
          scope[rctrl].edit = null;
          scope.editRargs = null;
        }
      };

      scope[rctrl].callCreate = function() {
        scope.createRargs = processArgs(arguments);

        scope[rctrl].createLoading = true;
        if (scope.createRargs.query == null) {
          scope.createRargs.query = scope[rctrl].query;
        }
        scope[rctrl]["new"].$create(scope.createRargs.query, function() {
          scope[rctrl].callNew();
          scope[rctrl].callIndex();
          scope[rctrl].createError = null;
          scope.$broadcast(rctrl + '.create success');
          scope.createRargs = null;
          scope[rctrl].createLoading = false;
        }, function(object) {
          if (object.data) {
            scope[rctrl].createError = object.data;
          }
          scope.$broadcast(rctrl + '.create failure');
          scope.createRargs = null;
          scope[rctrl].createLoading = false;
        });
      };

      scope[rctrl].callUpdate = function() {
        scope.updateRargs = processArgs(arguments);

        scope[rctrl].updateLoading = true;
        if (scope.updateRargs.query == null) {
          scope.updateRargs.query = scope[rctrl].query;
        }
        scope[rctrl]["edit"].$update(scope.updateRargs.query, function() {
          scope[rctrl].updateError = null;
          scope[rctrl].callIndex();
          scope.$broadcast(rctrl + '.update success');
          scope.updateRargs = null;
          scope[rctrl].updateLoading = false;
        }, function(object) {
          if (object.data) {
            scope[rctrl].updateError = object.data;
          }
          scope.$broadcast(rctrl + '.update failure');
          scope.updateRargs = null;
          scope[rctrl].updateLoading = false;
        });
      };

      scope[rctrl].callDelete = function(id, query) {
        scope[rctrl].deleteLoading = true;
        if (query == null) {
          query = scope[rctrl].query;
        }
        if (!query.id) {
          query.id = id;
        }
        railsResource["delete"](query, function() {
          scope[rctrl].callIndex();
          scope.$broadcast(rctrl + '.delete success');
          scope.updateRargs = null;
          scope[rctrl].deleteLoading = false;
        }, function() {
          scope.$broadcast(rctrl + '.delete failure');
          scope[rctrl].deleteLoading = false;
        });
      };

      scope[rctrl].clearId = function() {
        scope[rctrl].id = null;
        callShowAndEdit();
      };

      scope[rctrl].setId = function(id) {
        if (id == null) {
          id = attrs.raShow;
        }
        scope[rctrl].id = id;
        callShowAndEdit();
      };

      scope[rctrl].callNew();
      if (!!!attrs.raShow) {
        scope[rctrl].callIndex();
        scope[rctrl].clearId();
      } else {
        scope[rctrl].setId();
      }
    };
  }
]);
