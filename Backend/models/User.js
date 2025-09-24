const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ----------------- Experience -----------------
const experienceSchema = new Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  technologies: [{ type: String }]
}, { _id: false });

// ----------------- Project -----------------
const projectSchema = new Schema({
  projectName: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["In Progress", "Completed", "On Hold"],
    default: "In Progress"
  },
  technologies: [{ type: String }]
}, { _id: false });

// ----------------- User -----------------
const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile Info
  currentPosition: { type: String  },
  location: { type: String },
  additionalEmail: { type: String },
  website: { type: String },
  bio: { type: String },

  // Connections
  connections: [{ type: Schema.Types.ObjectId, ref: "User" }],

  // Experience, Skills, Projects
  experience: [experienceSchema],
  skills: [{ type: String }],
  projects: [projectSchema]

}, { timestamps: true });

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
