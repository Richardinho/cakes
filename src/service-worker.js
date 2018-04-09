import parse from 'url-parse';

//  needs to handle fetch events on user's first visit
self.onactivate = function(event){
  event.waitUntil(self.clients.claim());
};

//  todo: should be in IndexedDB, really
let store = [];

function isRESTRequest(url) {
  return url.indexOf('ec2-52-209-201-89.eu-west-1.compute.amazonaws.com') !== -1;
}

function getPathSegments(url) {
  url = url.substring(1)
  const parsedUrl = parse(url);
  const segments = parsedUrl.pathname.split('/');
  console.log(segments);
  return segments;
}

function isDetailRequest(url) {
  return getPathSegments(url).length === 4;
}

self.addEventListener('fetch', function(event) {
  let url = event.request.url;

  if (isRESTRequest(url)) {
    const method = event.request.method;

    if (method === 'GET') {
      if (store.length) {
        if (isDetailRequest(url)) {
          //  handle detail request
          const id = getPathSegments(url)[3];
          const cake = store.find((cake) => {
            return cake.id == id; 
          });
          return event.respondWith(new Response(JSON.stringify(cake)));
        } else {
          return event.respondWith(new Response(JSON.stringify(store))); 
        }
      } else {
        if (isDetailRequest(url)) {
          return event.respondWith(fetch(event.request, { mode: 'cors'}));
        } else {
          return event.respondWith(fetch(event.request, { mode: 'cors'}).then(response => {
            // clone response before reading as we need to return unread response
            let r = response.clone();
            response.json().then(data => {
              store = data;
            });
            return r;
          }));
        }
      } 
    } else if(method === 'PUT') {
      event.respondWith(event.request.json().then(data => {
        store.push(data);
        return new Response(JSON.stringify({ status: 'ok' }));
      }).catch((error) => {
        return new Response(JSON.stringify({ status: 'ok' }));
      }));
    }

  } else {
    event.respondWith(fetch(event.request));
  }
});
