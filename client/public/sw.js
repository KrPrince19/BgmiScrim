self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // This minimal fetch listener is required by some browsers to trigger the PWA install prompt.
  // It simply passes the request through to the network.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Optional: return a custom offline page or response here
      return new Response("You are offline.");
    })
  );
});
