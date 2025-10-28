// models/locationModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true, // one location per user
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

locationSchema.index({ location: "2dsphere" }); // crucial for nearby search

const Location = mongoose.model("Locations", locationSchema);
module.exports=Location;