const mongoose = require("mongoose");

const AccountType = {
  type: String,
  enum: ["Current", "Saving", "Cumulative"],
};
const AccountStatus = {
  type: String,
  enum: ["Active", "Closed"],
};
const Currency = {
  type: String,
  enum: ["GEL", "USD", "EUR", "RUB"],
};

const accountsSchema = mongoose.Schema({
  accountNumber: Number,
  accountType: AccountType,
  currency: Currency,
  accountStatus: AccountStatus,
  clientNumber: Number
});

module.exports = mongoose.model("Account", accountsSchema);
