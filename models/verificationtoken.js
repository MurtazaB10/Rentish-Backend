import mongoose from "mongoose";
const Schema = mongoose.Schema;

const verificationtokenSchema = Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required: true,
  },
  token: {
    type: String,

    required: true,
  },
  createdAt:{
      type:Date,
      expires:3600,
      default:Date.now()
  }
});

export default mongoose.model('verificationtoken',verificationtokenSchema);
