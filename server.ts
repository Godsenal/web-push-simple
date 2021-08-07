import express from "express";
import cors from "cors";
import { PushSubscription, sendNotification } from "web-push";
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from "./constants";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/"));
app.listen(port, function () {
  console.log("started on port " + port);
});

const tokenList: PushSubscription[] = [];

app.post("/register", function (req, res) {
  tokenList.push(req.body.subscription);

  res.send("success");
});

app.get("/notify", async (req, res) => {
  const options = {
    TTL: 24 * 60 * 60,
    vapidDetails: {
      subject: "http://localhost:3000",
      publicKey: VAPID_PUBLIC_KEY,
      privateKey: VAPID_PRIVATE_KEY,
    },
  };

  const payload = JSON.stringify({
    title: "Web Notification",
    body: "웹 알림입니다.",
    icon: "http://localhost:3000/icon.png",
    tag: "default tag",
    ...req.query,
  });

  try {
    await Promise.all(
      tokenList.map((t) => sendNotification(t, payload, options))
    );
  } catch (e) {
    console.error(e);
  }

  res.send("success");
});
