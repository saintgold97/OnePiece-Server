import mongoose from "mongoose";
const { Schema } = mongoose;

const crewsSchema = new Schema({
  english_name: { type: String, required: true },
  romaji_name: { type: String, required: true },
  total_bounty: { type: String, required: true },
  number_members: { type: Number, required: true },
  urlImg: {type: String}
},{ versionKey: false });

export const Crews = mongoose.model("crews", crewsSchema);
