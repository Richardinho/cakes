### Angular's routing demonstration app implemented in React
React and Angular are the foremost MVC frameworks for building Single Page Applications in Javascript.
Routing, that is to say the rendering of different content in response to changes in the URL without recourse to a full page refresh, is at the heart of such apps.
Both Angular and React not suprisingly therefore provide sophisticated routing capabilities.
I decided that it would be a good idea, for the purpose of comparing these capabilities, to create a version of Angular's demonstration app, featured in its routing documentation, but using React.

All the code can be seen [here]() so it would be pointless and boring to go through it in minutae. Instead what I want to do is examine some of the features of Angular routing and show how they can be implemented in React using my app as an example.

##### Configuring routes
Broadly speaking, React and Angulars routing system behave in similar ways.
That is, it is largely possible to imitate the behaviour of an Angular app using React.
The way they are implemented is however significantly different.
Angular employs what is sometimes called 'static routing'. 
This means that the routes are defined in a configuration file that runs at start up time. 
React, on the other hand, uses 'dynamic routing'. 
   
//  todo: show examples

In dynamic routing, there is no config file: Routes are React components with a some special functionality - i.e. 
the ability to respond to URL state changes. 
Because they are React components, they can be configured dynamically at runtime. 
This provides some flexibility not granted by Angular's router, but it also, as we will see, presents some difficulties of its own.

Conceptually, dynamic routing would seem preferable to static routing. With it you can define routes in response to the runtime environments and events that occur within it. 

Conceptually, dynamic routing would seem preferable to static routing so that an application is able to respond to changes in its environment.
For example, dynamic routing can be used in conjunction with media queries to allow components be mounted in response to viewport size changes.

On the other hand, Angular's routing system is more powerful than React's in some significant ways (as we shall see), but whether this is down to some fundamental difference between the two systems or a deficiency in React's implementation is open to question. As React's router evolves over time, we will find out the answer to this question.
It does seem to me that in static routing, where routing information is centralised, gives the app more control when making routing decisions than in dynamic routing where routing information is encapsulated within components.

##### Guards
A guard is a function which returns a boolean. As the name suggests, it sits between a route and a component and determines whether or not the component can be activated when the route becomes active.

Angular has support for guards offering several different kinds.

In the Hero app, access to admin pages is governed by a guard.
The guard checks to see if the user if logged in.
If so, it will permit the navigation to occur.
If not, it will redirect to the login page.
This is the function that carries out these actions.

```

  checklogin(url: string): boolean {
    if (this.authservice.isloggedin) { return true; }

    // store the attempted url for redirecting
    this.authservice.redirecturl = url;

    // create a dummy session id
    let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: { 'session_id': sessionId },
      fragment: 'anchor'
    };

    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);
    return false;
  }

```
Note that it will also save the current URL. 
This will allow the application to return to the current page we are on after the user has logged in.
The `navigationExtras` object allows you to see query parameters and hash fragments within the URL. 
They are less relevant to the present discussion.

React's router does not explicitly give any support for guards, but it is possible to write code that roughly does the same thing.
This basically comes down to some branching logic which renders the admin components when the user is logged in and a `<Redirect/>` component otherwise.

```
  if (this.props.adminservice.isloggedin()) {
    return (
      <div>
        <h3>admin</h3>
        <nav>
          <link to="/admin/dashboard">dashboard</link>
          <link to="/admin/manage-crisis">manage crises</link>
          <link to="/admin/manage-heroes">manage heroes</link>
        </nav>

        <route  path="/admin/manage-crisis" render={() => {
          return (<div classname="route">
            <h2>manage crisis</h2> 
            </div>) 
        }}/>

        <route path="/admin/dashboard" render={() => {
          return (<div>
            <h2>dashboard</h2> 
          </div>) 
        }}/>

        <route path="/admin/manage-heroes" render={() => {
          return (<div>
            <h2>manage heroes</h2> 
          </div>) 
        }}/>
      </div>
    )    
  } else {
    return (<redirect to="/login?returnto=/admin"/>);
  }

```
The guard used in the Angular app here simply determines whether or not a component should be activated. In Angular, there are more sopshisticated guards, such as guards that also preload data (the resolver) and a guard for determining whether or not to lazy load a module. Once again, in React, you have to implement these things yourself so Angular has a clear advantage over React in respect of guards.
#### Lazy Loading
todo: investigate lazy loading in React

#### Forms

#### Resolvers
The idea behind a resolver is that a component should only be activated if there is the correct data for it, otherwise it shouldn't.
A resolver therefore acts somewhat like a guard.
A resolver preloads data, or attempts to, before activating the component. 
If the data fetch is unsuccessful then the component will not be activated, and the application will redirect somewhere else. 

Angular has support for resolvers and they are used in the Hero app.
//  todo: look into using resolvers in React

### Named Outlets
In Angular, the component that is associated with the currently active route is rendered into a directive called an `outlet`.
In simple apps, there is just one outlet called the 'default'. It is possible though to have multiple outlets but in order to distinguish these they have to have a name.

React router does not have named outlets because it doesn't have outlets. Any component can become active in response to any route. 
It may seem that this allows the functionality of Angular's named outlets to be replicated easily enough in React, but in fact this is not so.
Angular provides utilities for creating and parsing URLs which allows one to not just express a single route, but in fact many.
Of course, it is possible to do this in React, but it requires manually writing the code yourself (or finding an appropriate library).


### Parameters
Parameters are the means of encapsulating data within the URL. When the URL is navigated to, this data can be passed to the component or components associated with that route. Since static data is not so useful, there are various ways of making the data variable.
Route parameters are where the data is part of the path itself. A part of parts of the route are defined to be parameters which can take any input and the route will still match.

### Observables
An Observable is data source which periodically emits data.
It is also known as a 'stream'.
They are somewhat like promises and streams can be used where these would normally have been used in web development, for example for reading data from a remote API.
Observables are not an integral part of Angular, but Angular was built with Observables very much in mind. Thus across the documentation you will find lots of examples using Observables.
One of the reasons why Observables are good is because they are a good fit with the event driven model of web applications. A series of user clicks on a button, for example, can be modelled as a stream.
Rxjs provides lots of useful utility functions for working with streams which allow lots of common programming problems to be solved easily.
In my view, one of the 'killer features' is the `SwitchMap`


It is possible to use Observables in React just as in Angular. Normally, React applications use the 'Flow' paradigm and use Redux for handling data. In this app, I have used Redux, but more for dependency injection. (The reducer hardly does anything!).
Is it possible to use Redux with Observables? 

### Redirects


#### Animations

### Styling active links  

### Handling dead links

#### Preloading
Lazy loading and preloading are not integrated into React's router but they can be implemented when using React in conjunction with the code splitting features of Webpack.The React router documentation gives a good example of lazy loading and preloading using the bundle-loader Webpack loader.



