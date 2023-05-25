import mongoose from "mongoose";
const { Schema } = mongoose;

const fruitsSchema = new Schema({
  romaji_name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  urlImg: {type: String}
},{ versionKey: false });

export const Fruits = mongoose.model("fruits", fruitsSchema);
