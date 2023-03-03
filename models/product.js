



import  mongoose from "mongoose";
let { Types, model,  Schema } =mongoose,
ProductSchema= new Schema({
  name: {
    required: true,
    type: String,
  },

  rentalprice: {
    type: Number
  },
   quantity: {
    type: Number,
    required: true,
  },
  costprice: {
    type: String,
    required: true,
  },
  onrent: {
    type: Boolean,
    default:false,
    required: true,
  },
  description: {
    type: String,
    
  },
  deposit: {
    type: Number,
    required: true,
  },
  coupon: {
    type: Array,
  
  },
  categoryy:{
    type:String,
    require:true
  },
  image: {
    type: Array,
    required: true,
  },
  manufacturer: {
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

    userId: {
        type: Types.ObjectId,
        
        ref: 'user'
    }

}, {timestamps: true}
);
export default model("product",ProductSchema);
