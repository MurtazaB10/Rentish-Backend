import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "product",
        },
        duration: {
          type: Number,
          required: true,
          default: 1,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },

  address: {
    type: String,
    required: true,
  },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  amount: Number,
  isPaid: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  returndate: { type: Date },
  Delivered: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("order", orderSchema);
