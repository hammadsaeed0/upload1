import express from "express";
import { RegisterBuyer , LoginBuyer , UpdateProfile, PostJob, UserJobs, UploadImage, UploadDocument, UserProfile } from "../controller/BuyerController.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.route("/RegisterBuyer").post(RegisterBuyer)
router.route("/LoginBuyer").post(LoginBuyer)
router.route("/UpdateProfile/:id").post(UpdateProfile)
router.route("/PostJob/:id").post(PostJob)
router.route("/UserJobs/:id").get(UserJobs)
router.route("/UserProfile/:id").get(UserProfile)
router.route("/UploadImage" , upload.array('avatars')).post(UploadImage);
router.route("/UploadDocument" , upload.array('documents')).post(UploadDocument);



export default router;
