import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";

const client = require("twilio")(
  process.env?.TWILIO_ACCOUNT_SID,
  process.env?.TWILIO_AUTH_TOKEN
);

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:4173",
      "http://localhost:5173",
    ],
  })
);

app.post("/chat/send", (req, res) => {
  const message = req?.body?.message;

  client.messages
    .create({
      from: `whatsapp:${process.env?.TWILIO_FROM}`,
      body: message || "",
      to: `whatsapp:${process?.env?.TWILIO_TO}`,
    })
    .then((message: { sid: string }) => console.log(message.sid));

  res.status(201).send({ message: "Message send" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
