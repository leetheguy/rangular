About
-----
Rangular is a script that allows AJAX calls to be made without writing Javascript. (OK, maybe one line)  
It is based on the Angular framework, built with Coffeescript and designed to be plugged into Rails web apps. (gemification coming soon)  
However, it can be modified to work with any RESTful framework.  

Rangular works by telling Angular how to talk to Rails and creates convenience methods and variables for RESTful server communication.  
The variables and methods are available directly from HTML with no configuration required. (OK, maybe one line)  

When I first started using Angular, I was amazed.  
It only took 10 minutes to learn enough Angular to allow me to do some amazing, dynamic things with little or no Javascript.  
However, I found the next step up, where things get really useful, to be extremely difficult.  
It was my intention in creating this tool to shelter new Angular users from some of the more daunting aspects of the framework while allowing them to continue doing even more amazing things within that "first 10 minute" window.  

I do however assume a solid understanding of Rails development.  
It is my hope that this tool can be useful for anybody wanting to add an AJAX kick to an application all the way up to people wanting to create simple one page apps.  

Usage
-----
Let's assume we have a Rails Controller called Notes and it's all set up to respond to and return JSON.  
You'll also need to make sure that rangular and any other necessary scripts are available from the asset pipeline.

First, you need to define your Angular application, or at least include the rangular module in it.  
Add the `ng-app` directive to any surrounding html element.  
Usually like `<body ng-app="yourApp">`.  

Now create a Javascript or Coffeescript file and add the following line.  

    angular.module("yourApp", ['rangular'])

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
    </div>

There are more methods and variables that allow full access to the Rails REST methods.  
But that really is all you need to get started.  
You can use `ng-click` to change visibility variables.  
And you can use `ng-show` and `ng-hide` to `toggle` the visibility of elements.  

Remember that you can pass variables from Rails to Javascript, but not the other way around. (not easily anyway)  
So `<div ra-controller="<%= controller_name %>">` should work.  
But `<%= link_to {{ note.name }}, {{ note }} %>` will not.  


Options
-------
These are options used with the rangular controller declaration.

* `ra-query`
  Used to pass extra params to the server.
  Pass in params with the JS object syntax.  
  example: `<div ra-controller="notes" ra-query="{page:4, limit:10}">`  

* `ra-show`
  Used to render a single element by default instead of an index.  
  example: `<div ra-controller="notes" ra-show="42">`  


Methods
-------


Variables
---------


Example App
-----------


Planned Features
----------------
* Error reporting 


More Info
---------
Coming Soon

