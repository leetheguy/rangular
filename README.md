About
-----
Rangular is a script that allows AJAX calls to be made without writing Javascript. (OK, maybe one line)  
It is based on the Angular framework and designed to be plugged into Rails web apps.
However, it can be modified to work with any RESTful framework.  

Rangular works by telling Angular how to talk to Rails and creates convenience methods and variables for RESTful server communication.  
The variables and methods are available directly from HTML with no configuration required. (OK, maybe one line)  

When I first started using Angular, I was amazed.  
It only took 10 minutes to learn enough Angular to allow me to do some amazing, dynamic things with little or no Javascript.  
However, I found the next step up, where things get really useful, to be extremely difficult.  
It was my intention in creating this tool to shelter new Angular users from some of the more daunting aspects of the framework while allowing them to continue doing even more amazing things within that "first 10 minute" window.  

I do however assume a solid understanding of Rails development.  
It is my hope that this tool can be useful for anybody wanting to add an AJAX kick to an application all the way up to people wanting to create simple one page apps.  

Quick Start
-----------

Javascript:

    angular.module("yourApp", ['rangular'])
    
HTML:

    <body ng-app="yourApp">
      <div ra-controller="notes">
        <ul>
          <li ng-repeat="note in notes.index">
            {{ note.name }}
            -
            {{ note.content }}
          </li>
        </ul>
      </div>
    </body>

AJAX!

Example App
-----------
Here is a working example that incorporates all of the features it can without having to write any JS.
As it stand's it's a complete and functional product that incorporates full CRUD in one page.

### [notejax](http://notejax.herokuapp.com/)

Usage
-----
Let's assume we have a Rails Controller called Notes and it's all set up to respond to and return JSON.  
You'll also need to make sure that rangular and any other necessary scripts are available from the asset pipeline.

First, you need to define your Angular application, or at least include the rangular module in it.  
Add the `ng-app` directive to any surrounding html element.  
Usually like `<body ng-app="yourApp">`.  

Now create a Javascript or Coffeescript file and add the following line.  

    angular.module("yourApp", ['rangular']);

Next, create an HTML element that will contain everything Notes related and add the `ra-controller` directive to it.  

    <div ra-controller="notes">
      This is all the notes.
    </div>

When you reload your page, if everything is wired up properly, you should now have access to all your RESTful methods.  
Some data has already been retrieved for you, namely the index and a new Note to be used in a form.  

You can see the index data by dropping this into your html inside of the `ra-controller` element:  

    {{ notes.index }}

You can display all of your notes with the `ng-repeat` directive.  

    <ul>
      <li ng-repeat="note in notes.index">
        {{ note.name }}
        -
        {{ note.content }}
      </li>
    </ul>

There are more methods and variables that allow full access to the Rails REST methods.  
But that really is all you need to get started.  
You can use `ng-click` to change visibility variables.  
And you can use `ng-show` and `ng-hide` to `toggle` the visibility of elements.  

Remember that you can pass variables from Rails to Javascript, but not the other way around (not easily anyway).  
So `<div ra-controller="<%= controller_name %>">` should work.  
But `<%= link_to {{ note.name }}, {{ note }} %>` will not.  

Core Concepts
-------------
Calling `ra-controller` creates an object with the same name as the controller.
The controller name is assumed to be a Rails controller and all restful connections are automatically created.
So `<div ra-controller="contacts">` will create a `contacts` object available to the view.
Any elements inside of the element that called ra-controller will have access to that object.
Calling `ra-controller` also calls the server's index and new actions so that data is immediately available.

Data returned from the server is stored in restfully named variables.

Server calls are made via restfully named functions.
Rangular functions should be run only as needed and not displayed like model data.
Attempting to display functions as model data will create an infinite loop of server calls.
That's a very bad thing.

* Good:
  `<button ng-click="contacts.callIndex()">`
* Bad:
  `{{ contacts.callIndex() }}`

Show and edit actions are both called by providing Rangular with an id via `setId(id)`.
Show and edit data are cleared with the `clearId()` function.

Each restful action has a corresponding loading variable to change what is displayed as your data is loading.

And for the more adventurous, each function calls a broadcaster that you can set up listeners for upon success or failure.
Each function allows for success and failure functions to be passed in as well.

Options
-------
These options can be used with the rangular controller declaration:  

* `ra-query`
  Used to pass extra params to the server.
  Pass in params with the JS object syntax.  
  example: `<div ra-controller="notes" ra-query="{page:4, limit:10}">`  

* `ra-show`
  Used to render a single element by default instead of an index.  
  example: `<div ra-controller="notes" ra-show="42">`  

Functions
---------
All functions are called like `controller_name.callIndex` where controller_name is the name of your controller.

`callIndex([query], [success_function, [failure_function]])`

  * automatically called when `ra-controller="controller_name"` is called
  * ignores `query.id` and any id set by `setId()`
  * sets variable `indexLoading` while waiting for server
  * broadcasts "controller_name.index ready" when finished successfully
  * broadcasts "controller_name.index error" when finished with errors
  * calls success_function when finished successfully
  * calls failure_function when finished with errors
  
`callShow([query], [success_function, [failure_function]])`

  * automatically called when id is set
  * sets variable `showLoading` while waiting for server
  * broadcasts "controller_name.show ready" when finished successfully
  * broadcasts "controller_name.show error" when finished with errors
  * calls success_function when finished successfully
  * calls failure_function when finished with errors
  
`callNew([query], [success_function, [failure_function]])`

  * automatically called when `ra-controller="controller_name"` is called
  * sets variable `newLoading` while waiting for server
  * broadcasts "controller_name.new ready" when finished successfully
  * broadcasts "controller_name.new error" when finished with errors
  * calls success_function when finished successfully
  * calls failure_function when finished with errors
  
`callCreate([query], [success_function, [failure_function]])`

  * sets variable `createLoading` while waiting for server
  * broadcasts "controller_name.create success" when finished successfully
  * broadcasts "controller_name.create failure" when finished with errors
  * calls success_function when finished successfully
  * calls failure_function when finished with errors
  * calls index and new upon success
  
`callEdit([query], [success_function, [failure_function]])`

  * automatically called when id is set
  * sets variable `editLoading` while waiting for server
  * broadcasts "controller_name.edit ready" when finished successfully
  * broadcasts "controller_name.edit error" when finished with errors
  * calls success_function when finished successfully
  * calls failure_function when finished with errors
  
`callUpdate([query], [success_function, [failure_function]])`

  * sets variable `updateLoading` while waiting for server
  * broadcasts "controller_name.update success" when finished successfully
  * broadcasts "controller_name.update failure" when finished with errors
  * calls success_function when finished successfully
  * calls failure_function when finished with errors
  * calls index and new upon success
  
`callDelete(id, [query])`

  * sets variable `deleteLoading` while waiting for server
  * broadcasts "controller_name.delete success" when finished successfully
  * broadcasts "controller_name.delete failure" when finished with errors
  * calls index and new upon success
  
`setId(id)`

  * sets variable `id`
  * makes id available from any function
  
  
  
`clearId()`

  * clears variable `id`
  
  

Variables
---------
All variables are called like `controller_name.index` where controller_name is the name of your controller.

The restful variables are index, show, edit, and new.
These variables contain the JSON that was returned from the server during a successful call.

The error variables are createError and updateError.
These variables contain error data that was returned from rails.
The errors come in the form of a hash where the keys are field names and the values are arrays of errors.
Example:

    "createError":{"name":    ["can't be blank","is too short (minimum is 5 characters)"],
                   "content": ["is too short (minimum is 20 characters)"],
                   "user":    ["can't be blank"]}

Other variables are query and id.
These probably shouldn't be changed directly as it can interfere with the internal workings of Rangular.
The query can be set as an option and the id can be changed with the `setId(id)` and `clearId()` functions.
Also, queries can be passed in to any of the restful call functions.

Callbacks and Broadcasters
--------------------------
#### Callbacks
Callbacks may be buggy, have unforseen concequences, and summon unknowable horrors from the darkest pits.
Proceed with caution or use broadcasters.

Callbacks (success and failure functions) should be declared as variables in JS.
I don't believe it's even possible to pass a function through HTML using Angular.
And even if you can, that's a very bad practice.

If you want to hide a form after a successfull server call, it would look something like this:

    var shutNew = function() {
      $scope.showNewNotes = false;
    }
    
Then in HTML:
    
    <form ng-show="showNewNotes">
      <button ng-click="notes.callCreate(shutNew)">
    </form>

Rangular uses scope without the dollar sign internally.
So if you want to access rangular variables from inside your own JS:

    if(scope.notes.id) {
      do.something.awesome;
    }
    
#### Broadcasters
Rangular uses `$broadcast` instead of `$emit` as broadcast sends messages down the scope stack to all the children.
Whereas emit sends messages up the scope stack to all the ancestors.
It was my goal in creating Rangular to allow controllers to be used multiple times during a page and to allow multiple controllers in a page.
As that's the case, I didn't want broadcasters to interfere with any other controllers.

In your JS:

    $scope.$on('notes.show ready', function() {
      do.something.awesome;
    });

Planned Features and Bug Fixes
----------------------------
  * implement callbacks in callDelete() function

