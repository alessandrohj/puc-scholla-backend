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
  school: {
    type: mongoose.Schema.Types.ObjectId, ref: 'School',
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: [ "admin", "professor", "parent", "student"],
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

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj._id;
  delete obj.__v;
  delete obj.role;
  return obj;
};

const Model = mongoose.model("Internal", schema);

export default Model;
