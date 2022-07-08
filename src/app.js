const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Account = require("./models/Accounts");
const Client = require("./models/Clients");
const getPaginationResponse = require("./helpers/get-pagination-response");

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
    ...getPaginationResponse(entities, req.query.bot, req.query.top),
  });
});

app.get("/api/clients", async (req, res, next) => {
  const entities = await Client.find();
  console.log(getPaginationResponse(entities, req.query.bot, req.query.top))
  res.status(200).json({
    ...getPaginationResponse(entities, req.query.bot, req.query.top),
  });
});

module.exports = app;
