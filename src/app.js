const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Account = require("./models/Accounts");
const Client = require("./models/Clients");

const app = express();

mongoose
  .connect(
    "mongodb+srv://seva:aRhgfGuPNag7oelx@cluster0.oszda.mongodb.net/shopDB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((e) => {
    console.log("Connection failed! ", e);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/api/accounts", async (req, res, next) => {
  const entities = await Account.find();
  res.status(200).json({
    message: "Successful",
    entities,
  });
});

app.get("/api/clients", async (req, res, next) => {
  const top = +req.query.top;
  const bot = +req.query.bot || 0;
  const pageSize = top - bot;
  const entities = await Client.find();
  res.status(200).json({
    message: "Successful",
    entities: entities.slice(bot, bot + top),
    pagination: {
      currentPage: bot / pageSize + 1,
      pageSize,
      pages: Math.round(entities.length / top) + 1,
    },
  });
});

module.exports = app;
