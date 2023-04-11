import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bankAccountSchema = new Schema({
  user_account_name: {
    type: String,
    required: true,
  },
  user_account_number: {
    type: String,
    required: true,
  },
  user_bank_code: {
    type: String,
    required: true,
  },
  user_bank_id: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  added_on: {
    type: Date,
    default: new Date(),
  },
});

export const BankAccountModel = model("Account", bankAccountSchema);
