import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 254,
    },
    classCode: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
    },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    goals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model("Class", schema);

export default Model;
