import mongoose from 'mongoose';
const { Schema } = mongoose;

const charactersSchema = new Schema({
    name: {type:String, required:true},
    role: {type:String, required:true},
    size: {type:String, required:true},
    age: {type:Number, required:true},
    bounty: {type:String, required:true},
    fruit: {type: String},
    crew: {type:String, required:true},
    urlImg: {type: String}
  },{ versionKey: false })
  
export const Characters = mongoose.model('characters', charactersSchema);