const mongoose = require("mongoose");

const AccountType = {
  type: String,
  enum: ["current", "saving", "cumulative"],
};
const AccountStatus = {
  type: String,
  enum: ["active", "closed"],
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
