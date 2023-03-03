import  mongoose from "mongoose";
let { Types, model,  Schema } =mongoose;
const feedbackSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  querymessage:{
      type:String,
      require:true
  },
  email:{
type:String,
require: true
  },
  date:{
      type:Date,
      default: Date.now
  }


})
export default model("feedback",feedbackSchema);