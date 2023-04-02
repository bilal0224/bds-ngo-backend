import e from "express";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  donations: {
    type: Number,
  },
  bloodType: {
    type: String,
  },
  phoneNumber: {
    type: "String",
    trim: true,
    unique: true,
  },
  associatedNGOs: [{ type: Schema.ObjectId, ref: "NGO" }],
});

export default mongoose.model('User', userSchema);
