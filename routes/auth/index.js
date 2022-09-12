import authenticate from "../../middleware/auth.js";
import express from "express";
import {User} from "../../models/index.js";
import sanitizeBody from "../../middleware/sanitizeBody.js";
import logger from "../../startup/logger.js";

const router = express.Router();

router.get("/users/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user._id)
   res.status(200).send({data: user})
});

router.post("/users", sanitizeBody, async (req, res, next) => {
  try {
    new User(req.sanitizedBody)
    .save()
    .then((newUser) =>
      res.status(201).send({ message: "New user created", data: newUser })
    )
  } catch (err) {
    logger.error(err)
    next(err)
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
  doc.password = password
  doc.save().then((savedDoc) => {
    res.status(200).send({message: 'Password successfully changed', user: savedDoc})
  }).catch(err => {
    res.status(400).send({title: "Error", message: 'Password was not changed.', err})
  })

})

export default router;
