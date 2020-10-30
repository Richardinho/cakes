# Using Workbox and Webpack with React
Every now and again, I like to review some of my Github projects to see if they need any updating, or if there are any improvements I can make to them.
On this occasion, I chose to look at a demonstration app that I created a few years ago for a job I was going for. It is a fairly simple React app using Webpack that shows a list of cakes and allows you create new cakes to add to this list.
One of the interesting features of this app is that instead of just storing the data in memory, it has a Service Worker which intercepts fetch calls and returns responses to  application with data from local variables within the Service Worker without making remote calls on the Network. This allowed me to create the app as if I was actually working with a real API. I envisaged that this approach would be useful if you were working on a project where the API was still in the process of being built, or perhaps for testing when you didn't want to have to make a call out to a network.

After updating some packages, I noticed that one package `serviceworker-webpack-plugin` was throwing errors. I thought perhaps this just needed an update, but it turned out that this package is no longer maintained.
Finding an alternative didn't seem like it would be too complicated, but it turned out to be a bit more difficult than I had anticipated (you could say that it wasn't a piece of cake), so I decided to write up my investigations in the hope that someone else may find this useful.

I started by finding out an alternative to the previously mentioned webpack plugin. My first port of call was the Webpack website. It recommends a Google project called *Workbox* and gives some instructions as to its use with Webpack.
As I review these instructions in retrospect, I have to say that these instructions are not a useful as they could be. They only give a very basic explanation of how Workbox works. The example only explains how to generate a Service Worker for caching assets, but this was no use to me since I wanted to use my own Service Worker file and I wasn't interested in caching. I guess the Webpack team might argue that it's not their job to provide documentation for third party plugins, but then the Workbox team might also reasonably claim that plugins for their library for use with Webpack are a lesser concern for them as well! What I will say is that when I did post an issue on the Workbox Github repository, I did get a very prompt response from one of their team. Lesson: Documentation is hard!

### Problem 1: missing __WB_MANIFEST variable
Workbox provides the `injectManifest` plugin for using a user provided Service Worker. Following the instructions [here](), it seems like this would be more or less a straightforward, like for like, replacement for my previous plugin.

I create the following config in `webpack.config.js`:

```
  plugins: [

    /*
      other plugins here...
    */

    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js',
    }),
  ],

```

And registered the Service Worker in my app.

```
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }

```

But I got the following error:

```
  ERROR in Can't find self.__WB_MANIFEST in your SW source.

```

The "solution" seemed to be to add the literal string `self.__WB_MANIFEST` to my Service Worker.
Seemingly the plugin was looking for this variable and barfed when it couldn't find it. 
It seems odd that the plugin can't just add this piece of boilerplate itself. Also, this isn't mentioned in the
Workbox documentation anywhere that I expected.

I added a comment to an issue in the Repo regarding this problem. https://github.com/GoogleChrome/workbox/issues/2253

## problem 2: 
Next, I added the code to the Service worker which I wanted to do the work of intercepting requests and returning
my custom response.
```

  import { registerRoute } from "workbox-routing";

  const matchFunction = ({url, request, event}) => {
    if(url.href) {
      return url.href.includes('someapi.com');
    }
    return false;
  };

  const handler = async () => {
    return new Response(JSON.stringify({foo: 'foo'}));
  };

  registerRoute(
    matchFunction,
    handler,
  );
```

This compiled ok, but in the Browser I got the error:
```
  sw.js:1 Uncaught ReferenceError: regeneratorRuntime is not defined
```


`regenerator-runtime` is a dependency on Workbox.
regenerator-runtime is an NPM module that converts generator code to ES5 code. https://github.com/facebook/regenerator

A Google search on this error produced various explanations:

1. This issue seems related, https://github.com/GoogleChrome/workbox/issues/2493, although GenerateSW rather than InjectManifest was being used.
2. Someone else found the same solution as me: https://medium.com/@binyamin/enabling-async-await-and-generator-functions-in-babel-node-and-express-71e941b183e2

In fact, `regenerator-runtime` is a dependency of both babel and of workbox.
```
$ npm ls regenerator-runtime

waracle-test@1.0.0 /Users/richardhunter/development/cakes
├─┬ react-router-dom@5.2.0
│ └─┬ @babel/runtime@7.12.1
│   └── regenerator-runtime@0.13.7
└─┬ workbox-webpack-plugin@5.1.4
  └─┬ workbox-build@5.1.4
    └─┬ strip-comments@1.0.2
      └─┬ babel-plugin-transform-object-rest-spread@6.26.0
        └─┬ babel-runtime@6.26.0
          └── regenerator-runtime@0.11.1
```

My understanding is that babel-preset attempts to transpile code that will run on all target browsers. In order to transpile Service Worker code, a dependency on regeneratorRuntime is required, but (for some reason) that isn't there.
This all seems a bit unsatisfactory since we have a plugin designed for use with Service Worker, which doesn't work properly on browsers that support Service Workers!

However, it seemed like the solution would be to set the target list of browsers to only those supporting Service Workers.
So Babel would not attempt to use the regenerator library.
In the babelrc, I set the target to Chrome 58 at the earliest. Once I recompiled, I no longer got the error.


## Problem 3:
My put request didn't seem to be going through my routing handler in the sw.
It turns out that route handlers don't handle PUT requests by default. You have to configure them with an extra parameter.
Feels like the Workbox routing guide might have mentioned this!

## Refactoring to not use InjectManifest
As I mentioned before, I actually got a very quick response from Jeffrey Posnick, one of the maintainers of Workbox, who gave the following advice:
> InjectManifest does manifest creation, self.__WB_MANIFEST replacement, and compilation, but if you don't need the precaching bits, the plugin doesn't need to be used.
You can follow the steps at https://developers.google.com/web/tools/workbox/guides/using-bundlers to just import the bits of Workbox that you do want to use (workbox-routing, workbox-strategies, etc.), and then compile your service worker file using webpack as if it were any other entry point.

I had already worked out all the above problems by this time and had a working app, but I decided to look into doing this. As a preamble, it's odd that Webpack doesn't mention this possibility. Also, I did actually try this in an earlier experiment and found it failing, but that could easily have been some other problem. The fact that someone with authority says this is possible makes me want to try it out.

I tried this and it worked. However, this makes me think that I never needed Workbox (or perhaps my previous plugin) in the first place!

## Conclusion
Eventually, I managed to get everything working. You can see the results [here](). Workbox looks like a useful abstraction over Service Workers  but its documentation could be improved. They need to cover the various *gotchas* that I've described in this article, and they also need to be a bit more clear that Workbox can be used for Service Workers in general, not just for caching assets.
