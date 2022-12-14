import authenticate from "../../middleware/auth.js";
import express from "express";
import {Internal, User} from "../../models/index.js";
import sanitizeBody from "../../middleware/sanitizeBody.js";
import logger from "../../startup/logger.js";

const router = express.Router();

router.get("/users/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user._id)
   res.status(200).send({data: user})
});

router.post("/users", sanitizeBody, async (req, res) => {
  const {role, schoolId, school, email, password} = req.sanitizedBody;
  if (role === "super" || role === "admin" || role === "dean") {
    res.status(404).send({message: "No access to create users with this role"});
  } else {
  try {
    const internalUser = await Internal.findOne({school: school, schoolId: schoolId}).populate('school').populate('schoolId');

    console.log(role);
    if (!internalUser || internalUser.role !== role) {
      res.status(400).send({message: "User not found"})
    } else {
    new User({
      firstName: internalUser.firstName,
      lastName: internalUser.lastName,
      schoolId: internalUser.schoolId,
      school: internalUser.school._id,
      role: internalUser.role,
      email: email,
      password: password,
    })
    .save()
    .then((newUser) =>
      res.status(201).send({ message: "New user created", data: newUser })
    )
    }
  } catch (err) {
    logger.error(err)
    res.status(400).send({ message: err.message })
  }
}
});

router.post("/tokens", sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody;
  const user = await User.authenticate(email, password);

  if (!user) {
    return res.status(401).send({
      errors: [
        {
          status: "401",
          message: "Incorrect username or password",
        },
      ],
    });
  }

  res.status(201).send({ data:{ token: user.generateAuthToken() }});
});

router.patch("/users/me", authenticate, sanitizeBody, async (req, res) => {
  const {email, password} = req.sanitizedBody
  const doc = await User.findById(req.user._id)
  if(email) doc.email = email
  if(password) doc.password = password
  doc.save().then((savedDoc) => {
    res.status(200).send({message: 'Account successfully updated', data: savedDoc})
  }).catch(err => {
    res.status(400).send({title: "Error", message: 'Account was not changed.', err})
  })

})

export default router;
