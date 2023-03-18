import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    value: {
      type: String,
      require: true,
    },
    isVer: {
      type: Boolean,
      require: true,
    },
  },
  password: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  phonenumber: {
    value: {
      type: String,
      require: true,
    },
    isVer: {
      type: Boolean,
      require: true,
    },
  },
  address: {
    type: String,
    require: true,
  },
  validation: {
    documenttype: {
      type: String,
    },
    documentnumber: {
      type: String,
    },

    path: {
      type: String,
    },
  },
  DOB: {
    type: Date,
    require: true,
  },
  scope: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        duration: {
          type: Number,
          required: true,
          default: 1,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  favouriteProducts: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
      },
    ],
  },
});

export default mongoose.model("user", userSchema);
