import mongoose from "mongoose";
const Schema = mongoose.Schema;

const freelancerSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  facebookUrl: {
    type: String,
  },
  instagramUrl: {
    type: String,
  },
  linkedInUrl: {
    type: String,
  },
  category: {
    require: true,
    type: String,
  },
  review: {
    items: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        numberOfStars: {
          require: true,
          type: Number,
        },
        feedback: {
          type: String,
        },
      },
    ],
  },
  skills: {
    require: true,
    type: Array,
  },
  expectedIncome: {
    require: true,
    type: Number,
  },
});

export default mongoose.model("freelancer", freelancerSchema);
