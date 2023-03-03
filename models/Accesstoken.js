import  mongoose from "mongoose";
let { Types, model,  Schema } =mongoose,
 AccessSchema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 60 * 60 * 1
    },
    userId: {
        type:Types.ObjectId,
        required: true
    }

}, {timestamps: true}
);
AccessSchema.index({"lastModifiedDate": 1 },{ expireAfterSeconds:  60 * 60  });
export default model('accessToken', AccessSchema);

