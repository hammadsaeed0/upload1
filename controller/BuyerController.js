import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import { Job } from "../model/Job.js";

cloudinary.v2.config({
  cloud_name: "dirfoibin",
  api_key: "315619779683284",
  api_secret: "_N7-dED0mIjUUa3y5d5vv2qJ3Ww",
});

// Register Buyer
export const RegisterBuyer = catchAsyncError(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 401));
  }
  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 409));
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

// Login Buyer
export const LoginBuyer = catchAsyncError(async (req, res, next) => {
  const { email, password, username } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  if (!username) {
    return next(new ErrorHandler("User Name Not Found", 401));
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  res.status(201).json({ success: true, message: "Login successful", user });
});

// Update Profile
export const UpdateProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    username,
    email,
    companyname,
    ownerName,
    role,
    skills,
    bio,
    hourlyRate,
    totalEarned,
    jobsCompleted,
    reviews,
    phoneNumber,
    languages,
    workHours,
    country,
    profilImage,
    companyImage,
    postedJobs,
  } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("No User Found", 401));
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (companyname) user.companyname = companyname;
    if (ownerName) user.ownerName = ownerName;
    if (role) user.role = role;
    if (skills) user.skills = skills;
    if (bio) user.bio = bio;
    if (hourlyRate) user.hourlyRate = hourlyRate;
    if (totalEarned) user.totalEarned = totalEarned;
    if (jobsCompleted) user.jobsCompleted = jobsCompleted;
    if (reviews) user.reviews = reviews;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (languages) user.languages = languages;
    if (workHours) user.workHours = workHours;
    if (country) user.country = country;
    if (profilImage) user.profilImage = profilImage;
    if (companyImage) user.companyImage = companyImage;
    if (postedJobs) user.postedJobs = postedJobs;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

// Post Job
export const PostJob = catchAsyncError(async (req, res, next) => {
  try {
    const {
      title,
      category,
      specialty,
      skills,
      estimateTime,
      budget,
      description,
      projectPdf,
      type,
    } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (!title) {
      return next(new ErrorHandler("Please Write Title", 409));
    }
    if (!category) {
      return next(new ErrorHandler("Please Add Category", 409));
    }
    if (!type) {
      return next(new ErrorHandler("Please Add Type", 409));
    }
    if (!specialty) {
      return next(new ErrorHandler("Please Add Specialty", 409));
    }
    if (!skills) {
      return next(new ErrorHandler("Please Add Skills", 409));
    }
    if (!estimateTime) {
      return next(new ErrorHandler("Please Add Time", 409));
    }
    if (!budget) {
      return next(new ErrorHandler("Please Add Cost", 409));
    }
    if (!description) {
      return next(new ErrorHandler("Please Add Description", 409));
    }

    const newJob = await Job.create({
      title,
      category,
      specialty,
      skills,
      estimateTime,
      budget,
      projectPdf,
      description,
      projectPdf,
      type,
      postedBy: id,
    });
    await newJob.save();

    // Update the user's postedJobs field
    await User.findByIdAndUpdate(
      id,
      { $push: { postedJobs: newJob._id } },
      { new: true }
    );

    res.json({
      message: "Job posted successfully",
      job: newJob,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Get User Jobs
export const UserJobs = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler("No User Found", 409));
  }
  // const userJobs = await Job.find({ postedBy: id });
  const userJobs = await Job.find({ postedBy: id }).sort({ createdAt: -1 });

  res.json({ message: "All Jobs", job: userJobs });
});

// Add User Images
export const UploadImage = async (req, res, next) => {
  let images = [];
  if (req.files && req.files.avatars) {
    if (!Array.isArray(req.files.avatars)) {
      images.push(req.files.avatars);
    } else {
      images = req.files.avatars;
    }
  }
  let responce = [];
  for (const image of images) {
    try {
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      const publidId = result.public_id;
      const url = result.url;
      let data = {
        publidId,
        url,
      };
      //  console.log(data);
      responce.push(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error uploading images" });
    }
  }
  // console.log("-->1",responce);
  //     res.json{responce , result}
  // res.send(responce);
  res.json({ success: true, data: responce });
};

// Add User Documents (PDF, Word, Excel)
export const UploadDocument = async (req, res, next) => {
  let documents = [];
  if (req.files && req.files.documents) {
    if (!Array.isArray(req.files.documents)) {
      documents.push(req.files.documents);
    } else {
      documents = req.files.documents;
    }
  }
  let response = [];
  for (const document of documents) {
    try {
      const result = await cloudinary.v2.uploader.upload(
        document.tempFilePath,
        {
          resource_type: "raw", // Upload as raw file type
        }
      );

      const publicId = result.public_id;
      const url = result.url;
      let data = {
        publicId,
        url,
      };
      response.push(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error uploading documents" });
    }
  }

  res.json({ success: true, data: response });
};

// Post Job
export const UserProfile = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.params.id; // Get the user ID from the route parameter
    const user = await User.findById(userId).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});
