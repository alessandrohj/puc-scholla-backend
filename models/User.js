import mongoose from "mongoose";

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
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 512,
    set: function (value) {
      return value.toLowerCase();
    },
    validate: {
      validator: (value) => {
        //TODO: add validator
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  password: { type: String, trim: true, required: true, maxlength: 70 },
});

const Model = mongoose.model("User", schema);

export default Model;