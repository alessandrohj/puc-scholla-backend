import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const saltRounds = 14;
const jwtPrivateKey = "mySuperSecretKey";
//TODO: transform it into env variable

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
    maxlength: 70,
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
    enum: ["dean", "admin", "professor", "parent", "student", "super"],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId, ref: 'School',
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Internal',
    required: true,
},
},
{
  timestamps: true
}
);

schema.methods.generateAuthToken = function () {
  const payload = { uid: this._id };
  return jwt.sign(payload, jwtPrivateKey, {expiresIn: '1h', algorithm: 'HS256'});
};

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email });
  const badHash = `$2b$${saltRounds}$invalid@U#erj23IRUJQNFI324OK4`;
  const hashedPassword = user ? user.password : badHash;
  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  return passwordMatch ? user : null;
};

schema.statics.canCreateClass = async function (id) {
  const user = await this.findById(id);
  const hasAccess = user.role === 'admin' || 'dean' ? true : false 
  return {user: user, hasAccess: hasAccess, school: user.school}
}

schema.statics.hasTotalAccess = async  function (id) {
  const user = await this.findById(id);
  const hasAccess = user.role === 'super' ? true : false 
  return {user: user, hasAccess: hasAccess}
}

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, saltRounds);
});

// schema.pre("validate", async function(next) {
//   const schoolUser = await School.findById(this.school._id).findOne({schoolId: this.schoolId})
//   if (!schoolUser)  return 'Invalid school id';
//   next()

// })

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.role;
  return obj;
};

schema.plugin(uniqueValidator, {
  message: function (props) {
    if (props.path === "email") {
      return `The email address ${props.value} is already registered`;
    } else {
      return `The ${props.path} must be unique. ${props.path} is already in use.`;
    }
  },
});

const Model = mongoose.model("User", schema);

export default Model;
