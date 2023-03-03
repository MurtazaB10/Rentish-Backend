import  mongoose from "mongoose";
let { Types, model,  Schema } =mongoose,
 RefreshSchema = new Schema({
    refreshToken: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 60 * 60 * 24 * 7
    },
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'user'
    }

}, {timestamps: true}
);
RefreshSchema.index({"lastModifiedDate": 1 },{ expireAfterSeconds: 60 * 60 * 24 * 7 });
export default model('refreshToken', RefreshSchema);
