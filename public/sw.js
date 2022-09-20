console.log("Registered");

//CHACHE ALL FILES
let cacheData = "appv1";
this.addEventListener("install", (event) => {
  console.log("creating cache");
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

//FETCH ALL IN OFFLINE MODE
// this.addEventListener("fetch", (event) => {
//   console.log("1fetching  cache");
//   if (!navigator.onLine) {
//     //PUSH NOTIFICATION WHEN URL IS BELOW MENTIONED ONE
//     if (event.request.url === "http://localhost:3000/manifest.json") {
//       event.waitUntil(
//         this.registration.showNotification("You Are Offline", {
//           body: "Make sure that you internet connection is stable to get the latest updates and feature. Thankyou!",
//         })
//       );
//     }

//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         if (response) {
//           return response;
//         }
//         let requestUrl = event.request.clone();
//         fetch(requestUrl)
//           .then((res) => {
//             console.log(res);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//     );
//   }
// });

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        if (resp) {
          return resp;
        }
      })
    );
  }
});
