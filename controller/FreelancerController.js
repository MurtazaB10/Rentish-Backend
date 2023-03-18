import db from "../models/index.js";
import response from "../utils/response.js";
import dotenv from "dotenv";
dotenv.config();

class FreelancerController {
  getFreelancers = async (req, callback) => {
    try {
      const freelancers = await db.Freelancer.find({})
        .populate("user")
        .populate("review.items.user");
      console.log(freelancers);
      callback(
        response("success", "fetched freelancers successfully!", freelancers)
      );
    } catch (error) {
      console.log(error);
      callback(response("error", "error while fetching freelancers", error));
    }
  };

  getFreelancer = async (req, callback) => {
    try {
      const freelancer = await db.Freelancer.find({ user: req.user._id })
        .populate("user")
        .populate("review.items.user");
      console.log(freelancer);
      callback(
        response("success", "fetched freelancer successfully!", freelancer)
      );
    } catch (error) {
      console.log(error);
      callback(response("error", "error while fetching freelancer", error));
    }
  };

  updateFreelancer = async (req, callback) => {
    try {
      const id = req.user._id;
      const freelancer = await db["Freelancer"].findOneAndUpdate(
        { user: id },
        {
          user: id,
          facebookUrl: req.body.facebookUrl,
          instagramUrl: req.body.instagramUrl,
          linkedInUrl: req.body.linkedInUrl,
          category: req.body.category,
          skills: req.body.skills,
          expectedIncome: req.body.expectedIncome,
        },
        {
          new: true,
          upsert: true,
        }
      );
      console.log(freelancer);
      callback(response("success", "freelancer updated", freelancer));
    } catch (error) {
      console.log(error);
      callback(response("error", "error while updating freelancer", error));
    }
  };
}

export default FreelancerController;
