import parse from 'url-parse';
import { registerRoute } from "workbox-routing";
import "regenerator-runtime/runtime";

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

let store = [];

function getPathSegments(url) {
  url = url.substring(1)
  const parsedUrl = parse(url);
  const segments = parsedUrl.pathname.split('/');
  return segments;
}

const matchGetCake = ({url, request, event}) => {
  return url.href.includes('api/get-cake');
};

const matchGetCakes = ({url, request, event}) => {
  return url.href.includes('api/get-all-cakes');
};

const matchPutCake = ({url, request, event}) => {
  return url.href.includes('api/put-cake');
};

const getCakeHandler = async ({url, event}) => {
  const pathSegments = getPathSegments(url.href);
  const id = pathSegments[3];
  const cake = store.find((cake) => {
    return cake.id == id; 
  });

  return new Response(JSON.stringify(cake));
};

const getCakesHandler = async () => {
  return new Response(JSON.stringify(store));
}

const putCakeHandler = async ({event}) => {
  return event.request.json().then(data => {
    store.push(data);
    return new Response(JSON.stringify({ status: 'ok' }));
  }).catch((error) => {
    return new Response(JSON.stringify({ status: 'ok' }));
  });
}

registerRoute(matchGetCake, getCakeHandler);
registerRoute(matchGetCakes, getCakesHandler);
registerRoute(matchPutCake, putCakeHandler, 'PUT');



