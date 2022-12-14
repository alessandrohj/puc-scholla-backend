import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dean: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  professors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  expire: {
    type: Date,
    required: false
  }
},
{
  timestamps: true
});

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};


const Model = mongoose.model('School', schema)

export default Model