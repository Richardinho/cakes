# Cakes project
A website for displaying delicious cakes. The user can see a list of cakes, navigate to a detail page for an individual cake, and add their own cakes.

To build project.
```
npm run build
```
Run a web server (e.g. live-server) using `/dist` as the root folder.

```
live-server dist
```

## Service Worker

I had problems using the endpoint. I could make GET requests, but POST and PUT requests seemed to fail. To allow me to get something up and running, I am using a service worker as a proxy server. It makes an initial request for the data and stores it in memory. All subsequent requests, both GET and PUT use this location in memory rather than the remote endpoint.

Service workers are useful for providing an 'offline' experience to users. An improvement to this app would be to cache data on every request, then, whenever a remote request fails, fallback to getting data from the local cache. Another improvement would be to use IndexedDB for storing data.
