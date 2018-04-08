//  needs to handle fetch events on user's first visit
self.onactivate = function(event){
  event.waitUntil(self.clients.claim());
};

//  todo: should be in IndexedDB, really
let store = [];

function isRESTRequest(url) {
  return url.indexOf('ec2-52-209-201-89.eu-west-1.compute.amazonaws.com') !== -1;
}

self.addEventListener('fetch', function(event) {
  let url = event.request.url;

  if (isRESTRequest(url)) {
    const method = event.request.method;

    if (method === 'GET') {
      if(store.length) {
        return event.respondWith(new Response(JSON.stringify(store))); 
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
