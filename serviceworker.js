self.addEventListener("push", (event) => {
  let { title, body, icon, tag } = JSON.parse(event.data && event.data.text());

  event.waitUntil(
    self.registration.showNotification(title || "", { body, tag, icon })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = "http://localhost:1234";

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        if (clientList.length > 0) {
          // 이미 열려있는 탭이 있는 경우
          return clientList[0]
            .focus()
            .then((client) => client.navigate(urlToOpen));
        }
        return self.clients.openWindow(urlToOpen);
      })
  );
});
