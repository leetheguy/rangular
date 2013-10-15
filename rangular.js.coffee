rangular = angular.module('rangular', ["ngResource"])

railsRoutesSet =
  index:
    method: "GET"
    isArray: true
  show:
    method: "GET"
  new:
    method: "GET"
    params:
      verb: "new"
  create:
    method: "POST"
  edit:
    method: "GET"
    params:
      verb: "edit"
  update:
    method: "PUT"
  destroy:
    method: "DELETE"
  info:
    method: "GET"
    params:
      verb: "info"

rangular.config ["$httpProvider", ($httpProvider) ->
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
]

rangular.factory "railsResource", ["$resource", ($resource) ->
  $resource("/:controller/:id/:verb", {id: '@id'}, railsRoutesSet)
]

rangular.directive 'raController', ["railsResource", (railsResource) ->
  (scope, element, attrs) ->
    rctrl  = attrs.raController
    scope[rctrl] = {}
    scope[rctrl].query = if attrs.query == undefined then {} else eval('('+attrs.query+')')
    scope[rctrl].query.controller = rctrl

    scope[rctrl].callIndex = (query = scope[rctrl].query) ->
      query.id = null
      scope[rctrl].index = railsResource.index query, ->
        scope.$broadcast rctrl+'.index ready'

    callShowAndEdit = (query = scope[rctrl].query) ->
      scope[rctrl].callShow(query)
      scope[rctrl].callEdit(query)

    scope[rctrl].callShow = (query = scope[rctrl].query) ->
      if !!scope[rctrl].id
        query.id = scope[rctrl].id

        scope[rctrl].show = railsResource.show query, ->
          scope.$broadcast rctrl+'.show ready'
      else
        scope[rctrl].show = null

    scope[rctrl].callEdit = (query = scope[rctrl].query) ->
      if !!scope[rctrl].id
        query.id = scope[rctrl].id

        scope[rctrl].edit = railsResource.edit query, ->
          scope.$broadcast rctrl+'.edit ready'
      else
        scope[rctrl].edit = null

    scope[rctrl].callNew = (query = scope[rctrl].query) ->
      scope[rctrl].new = railsResource.new query, ->
        scope.$broadcast rctrl+'.new ready'

    scope[rctrl].callCreate = (query = scope[rctrl].query) ->
      scope[rctrl].new.$create query, ->
        scope[rctrl].callIndex()
        scope[rctrl].callNew()
        scope.$broadcast rctrl+'.create success'

    scope[rctrl].callUpdate = (query = scope[rctrl].query) ->
      scope[rctrl].edit.$update query, ->
        callShowAndEdit()
        scope[rctrl].callIndex()
        scope.$broadcast rctrl+'.update success'

    scope[rctrl].callDelete = (id, query = scope[rctrl].query) ->
      query.id = id
      railsResource.delete query, ->
        scope[rctrl].callIndex()
        scope.$broadcast rctrl+'.delete success'

    scope[rctrl].info = (query) ->
      query.controller = rctrl if query.controller == undefined
      scope[rctrl].info = railsResource.info query, ->
        scope.$broadcast rctrl+'.info ready'

    scope[rctrl].clearId = ->
      scope[rctrl].id = null
      callShowAndEdit()

    scope[rctrl].setId = (id = attrs.show) ->
      scope[rctrl].id = id
      callShowAndEdit()

    scope[rctrl].callNew()
    if !!!attrs.show
      scope[rctrl].callIndex()
      scope[rctrl].clearId()
    else
      scope[rctrl].setId()
]

