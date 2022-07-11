const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Account = require("./models/Accounts");
const Client = require("./models/Clients");
const getPaginationResponse = require("./helpers/get-pagination-response");

const multer = require("multer");
const path = require("path");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "assets/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

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
app.use("/images", express.static(path.join("assets/images")));

/* --accounts-- */
app.get("/api/accounts", async (req, res, next) => {
  const entities = await Account.find(
    req.query.clientNumber ? { clientNumber: req.query.clientNumber } : {}
  );
  res.status(200).json({
    ...getPaginationResponse(entities, req.query.bot, req.query.top),
  });
});

app.post("/api/closeAccount", (req, res, next) => {
  Account.updateOne({ _id: req.body.id }, { $set: { accountStatus: "closed" } })
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't udpate account!",
      });
    });
});

/* --clients-- */

app.get("/api/clients", async (req, res, next) => {
  const entities = await Client.find();
  res.status(200).json({
    ...getPaginationResponse(entities, req.query.bot, req.query.top),
  });
});

app.post(
  "/api/clients",
  multer({ storage: storage }).single("photo"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const client = new Client({
      ...req.body,
      legalAddress: JSON.parse(req.body.legalAddress),
      physicalAddress: JSON.parse(req.body.physicalAddress),
      photoPath: url + "/images/" + req.file.filename,
    });
    client.save();
    res.status(200).json({
      message: "Successful",
    });
  }
);

app.delete("/api/clients", async (req, res, next) => {
  await Client.deleteOne({ _id: req.body.id });
  res.status(200).json({ message: "Client deleted!" });
});

app.put("/api/clients", (req, res, next) => {
  const client = new Client(req.body);

  Client.updateOne({ _id: req.body._id }, client)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update client!",
      });
    });
});

// 4 img formdata
module.exports = app;
