import mongoose from "mongoose";
const { Schema } = mongoose

const NGOSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64,
    },
    members: [{type: Schema.ObjectId, ref: "User"}]
});

export default mongoose.model('NGO', NGOSchema);