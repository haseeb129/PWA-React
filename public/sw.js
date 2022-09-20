//CHACHE ALL FILES
let cacheData = "appv1";
this.addEventListener("install", (event) => {
  console.log("Installed");
  event.waitUntil(
    caches.open(cacheData).then((cacheres) => {
      cacheres.addAll([
        "/static/js/bundle.js",
        "/static/js/vendors~main.chunk.js",
        "/static/js/main.chunk.js",
        "/favicon.ico",
        "/index.html",
        "/",
        "/users",
        "/about",
      ]);
    })
  );
});

this.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("gih-cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    console.log("event.request.url", event.request.url);
    if (event.request.url === "http://localhost:3000/manifest.webmanifest") {
      event.waitUntil(
        this.registration.showNotification("You Are Offline", {
          body: "Make sure that you internet connection is stable to get the latest updates and feature. Thankyou!",
        })
      );
    }

    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        let requestUrl = event.request.clone();
        fetch(requestUrl)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      })
    );
  }
});

// this.addEventListener("fetch", (event) => {
//   const url = event.request.url;
//   console.log("Inside new Fetch", url);

//   event.respondWith(
//     fetch(event.request)
//       .then((res) => {
//         console.log("inside Then", res);
//         const resClone = res.clone();
//         caches.open(cacheData).then((cache) => {
//           cache.put(url, resClone);
//         });
//         return res;
//       })
//       .catch((err) => {
//         caches.match(event.request).then((res) => res);
//         console.log(err);
//       })
//   );
// });
