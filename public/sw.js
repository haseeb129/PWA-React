//CHACHE ALL FILES
let cacheData = "appv1";
this.addEventListener("install", (event) => {
  skipWaiting();
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
        "/sw.js",
        "/manifest.webmanifest",
        "/icon-192x192.png",
      ]);
    })
  );
});

this.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());

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

// this.addEventListener("fetch", (event) => {
//   if (!navigator.onLine) {
//     console.log("event.request.url", event.request.url);
//     if (event.request.url === "http://localhost:3000/manifest.webmanifest") {
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

this.addEventListener("fetch", function (event) {
  if (!navigator.onLine) {
    if (event.request.url === "http://localhost:3000/manifest.webmanifest") {
      event.waitUntil(
        this.registration.showNotification("You Are Offline", {
          body: "Make sure that you internet connection is stable to get the latest updates and feature. Thankyou!",
        })
      );
    }
  }
  event.respondWith(
    caches.open(cacheData).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (navigator.onLine) {
          return fetch(event.request).then(function (response) {
            if (event.request.method == "GET") {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        } else {
          if (response) {
            return response;
          } else {
            return null;
          }
        }
      });
    })
  );
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

this.addEventListener("sync", function (event) {
  if (event.tag === "order") {
    this.registration.showNotification("You Are Online", {
      body: "Submiting Pending Requests. Thank you!",
    });
    event.waitUntil(getOrderData());
  }
});

function getOrderData() {
  console.log("getOrderData");
  var indexDBOpenRequest = indexedDB.open("order", 1);

  indexDBOpenRequest.onsuccess = function () {
    let db = this.result;
    let transaction = db.transaction("order_request", "readwrite");
    let storeObj = transaction.objectStore("order_request");
    let cursorRequest = storeObj.openCursor();

    cursorRequest.onsuccess = function (evt) {
      var cursor = evt?.target?.result;
      if (cursor) {
        console.log("cursor Value", cursor?.value);
        sendTableOrder(cursor.value, cursor.key);
        cursor.continue();
      }
    };
  };
  indexDBOpenRequest.onerror = function (error) {
    console.error("IndexedDB error:", error);
  };
}

function sendTableOrder(data, index) {
  console.log("Sending request again");

  const URL = "https://jsonplaceholder.typicode.com/";

  fetch(URL + "albums", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response) {
        deleteFromIndexdb(index);
      }
    })
    .catch((error) => {
      console.log("Error API", error);
    });
}

// delete data from indexedb, that sent to server
function deleteFromIndexdb(index) {
  console.log("deleteFromIndexdb", index);
  var indexDBOpenRequest = indexedDB.open("order", 1);
  indexDBOpenRequest.onsuccess = function () {
    let db = this.result;
    let transaction = db.transaction("order_request", "readwrite");
    let storeObj = transaction.objectStore("order_request");
    storeObj.delete(index);
  };
}
