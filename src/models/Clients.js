const mongoose = require("mongoose");

const Gender = {
  type: String,
  enum: ["Male", "Female"],
};

const Address = {
  country: String,
  city: String,
  address: String,
};

const clientsSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: Gender,
  personalNumber: String,
  mobileNumber: Number,
  legalAddress: Address,
  physicalAddress: Address,
  photo: String,
});

module.exports = mongoose.model("Client", clientsSchema);
