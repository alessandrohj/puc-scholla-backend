import mongoose from "mongoose";
import validator from "validator";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";


const saltRounds = 14;

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
        validator.isEmail(value);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  password: { type: String, trim: true, required: true, maxlength: 70 },
  role: {
    type: String,
    required: true,
    enum: ['dean', 'admin', 'professor', 'parent', 'student']
  },
});

schema.methods.generateAuthToken = function () {
const payload = {user: {_id: this._id}}
return jwt.sign(payload, 'mySecretKey', {
  expiresIn: '1h',
  algorithm: 'HS256',
})
//TODO: update it to env variable
}

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email });
  const badHash = `$2b$${saltRounds}$invalid@U#erj23IRUJQNFI324OK4`;
  const hashedPassword = user ? user.password : badHash;
  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  return passwordMatch ? user : null
}

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, saltRounds)
})

const Model = mongoose.model("User", schema);

export default Model;
