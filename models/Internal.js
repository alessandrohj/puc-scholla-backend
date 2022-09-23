import mongoose from "mongoose";

// const schema = mongoose.model('User').findOne({role: 'student'})
const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 64,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 64,
    trim: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  isProfessor: {
    type: Boolean,
    required: true
  },
  isStudent: {
    type: Boolean,
    required: true
  },
  studentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: false,
    },
  ],
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: false,
    },
  ],
});

const Model = mongoose.model("Internal", schema);

export default Model;
