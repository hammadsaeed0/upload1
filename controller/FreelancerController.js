import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
import { Job } from "../model/Job.js";
import { Bids } from "../model/Bid.js";

cloudinary.v2.config({
  cloud_name: "dirfoibin",
  api_key: "315619779683284",
  api_secret: "_N7-dED0mIjUUa3y5d5vv2qJ3Ww",
});

// Get All Jobs with Case-Insensitive Filters
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  try {
    const filters = req.query; // Get the query parameters from the request

    // Build the filter object based on the query parameters
    const filterObject = {};
    if (filters.category)
      filterObject.category = { $regex: new RegExp(filters.category, "i") };
    if (filters.specialty)
      filterObject.specialty = { $regex: new RegExp(filters.specialty, "i") };
    if (filters.skills) {
      const skillsArray = filters.skills
        .split(",")
        .map((skill) => skill.trim());
      filterObject.skills = { $in: skillsArray };
    }
    if (filters.type) filterObject.type = { $in: filters.type.split(",") }; // Convert CSV to array and filter
    if (filters.minBudget && filters.maxBudget) {
      filterObject.budget = {
        $gte: parseInt(filters.minBudget),
        $lte: parseInt(filters.maxBudget),
      };
    } else if (filters.minBudget) {
      filterObject.budget = {
        $gte: parseInt(filters.minBudget),
      };
    } else if (filters.maxBudget) {
      filterObject.budget = {
        $lte: parseInt(filters.maxBudget),
      };
    }

    const allJobs = await Job.find(filterObject).sort({ createdAt: -1 });

    res.json({ message: "All Jobs", jobs: allJobs });
  } catch (error) {
    next(error);
  }
});

// Get Single Job
export const getSingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id).populate("postedBy", "username");
    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
});

// Submit Proposal
export const submitProposal = catchAsyncError(async (req, res, next) => {
  const {
    jobId,
    bidder,
    bidPrice,
    deductionPrice,
    totalPriceAfterFee,
    additionalInfo,
  } = req.body;

  // Check if the bidder exists
  const user = await User.findById(bidder);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the job ID exists
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  // Check if the user who posted the job is the same as the bidder
  if (job.postedBy.toString() === bidder) {
    return next(new ErrorHandler("You cannot bid on your own job", 403));
  }

  // Check if the user has already submitted a bid for this job
  const existingBid = await Bids.findOne({ job: jobId, bidder });
  if (existingBid) {
    return next(new ErrorHandler("You have already applied to this job", 409));
  }
  
  // Create a new bid
  const newBid = new Bids({
    job: jobId,
    bidder,
    bidPrice,
    totalPriceAfterFee,
    deductionPrice,
    additionalInfo,
  });

  // Save the bid
  await newBid.save();

  // Add the bid to the job's bids array
  job.bids.push(newBid);
  await job.save();

  res.status(201).json({
    success: true,
    message: "Bid submitted successfully",
    bid: newBid,
  });
});

// Get Single Proposal with Job Details
export const getSingleProposal = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the proposal by ID and populate the 'job' field
    const proposal = await Bids.findById(id).populate('job');

    if (!proposal) {
      return next(new ErrorHandler("Proposal not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Proposal fetched successfully",
      proposal,
    });
  } catch (error) {
    next(error);
  }
});

// Get All Proposals by Freelancer
export const getAllProposals = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params; // Get the freelancer's ID from the request parameters

    const proposals = await Bids.find({ bidder: id }) // Find all proposals submitted by the freelancer and populate the 'job' field

    res.json({ message: "All Proposals", proposals });
  } catch (error) {
    next(error);
  }
});
