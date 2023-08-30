import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GalleryItemSchema = new Schema({
  publicId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    default: "no name",
  },
  ownerName: {
    type: String,
    default: "no name",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["buyer", "freelancer"], // Specify possible roles
    default: "buyer", // Set the default role to "buyer"
    required: true,
  },
  skills: [
    {
      type: String,
    },
  ],
  bio: String,
  hourlyRate: Number,
  totalEarned: Number,
  jobsCompleted: Number,
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: String,
    },
  ],
  phoneNumber: {
    type: String,
    default: "Add Phone Number",
  },
  languages: [String],
  workHours: String,
  country: {
    type: String,
    default: "Add Country",
  },
  profilImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dirfoibin/image/upload/v1692959666/v1yzsrscplo3klmsmldp.png",
  },
  companyImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dirfoibin/image/upload/v1692959666/v1yzsrscplo3klmsmldp.png",
  },
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
