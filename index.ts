import { VAPID_PUBLIC_KEY } from "./constants";

Notification.requestPermission().then((status) => {
  console.log("Notification 상태", status);

  if (status === "denied") {
    alert("Notification 거부됨");
  } else if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY,
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        console.log(pushSubscription);
        const element = document.getElementById("checkbox");
        element && ((element as HTMLInputElement).checked = true);
        postSubscription(pushSubscription);
      });
  }
});

function postSubscription(Subscription: PushSubscription) {
  const subscription = JSON.stringify({ subscription: Subscription.toJSON() });

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: subscription,
  }).then(function (data) {
    console.log(data);
  });
}
