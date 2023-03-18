import mongoose from "mongoose";
let { Types, model, Schema } = mongoose,
  PostSchema = new Schema(
    {
      title: {
        required: true,
        type: String,
      },

      description: {
        required: true,
        type: String,
      },

      pricePerHour: {
        type: Number,
      },

      pricePerDay: {
        type: Number,
      },

      image: {
        type: Array,
      },

      status: {
        items: [
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: "user",
              required: true,
            },
            isAccepted: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },

      isValid: {
        type: Boolean,
        default: true,
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },

      userId: {
        type: Types.ObjectId,
        ref: "user",
      },
    },
    { timestamps: true }
  );
export default model("post", PostSchema);
