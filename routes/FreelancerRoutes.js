import express from "express";
import { getAllJobs, getAllProposals, getSingleJob, getSingleProposal, submitProposal } from "../controller/FreelancerController.js";

const router = express.Router();

router.route("/getAllJobs").get(getAllJobs)
router.route("/getSingleJob/:id").get(getSingleJob)
router.route("/submitProposal").post(submitProposal)
router.route("/getSingleProposal/:id").post(getSingleProposal)
router.route("/getAllProposals/:id").post(getAllProposals)

export default router;
