import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Reference to the Job model
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  bidPrice: {
    type: Number,
    required: true,
  },
  totalPriceAfterFee: {
    type: Number,
    required: true,
  },
  deductionPrice: {
    type: Number,
    required: true,
  },
  additionalInfo: String,
});

export const Bids = mongoose.model("Bid", bidSchema);
