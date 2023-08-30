import mongoose from "mongoose";
import { Bids } from "./Bid.js";
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  specialty: String,
  skills: [
    {
      type: String,
    },
  ],
  estimateTime: String,
  budget: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectPdf: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid", // Reference to the Bid model
    },
  ],
  
});

export const Job = mongoose.model("Job", jobSchema);
