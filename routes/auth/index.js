import express from "express";
import {User} from "../../models/index.js";
import sanitizeBody from "../../middleware/sanitizeBody.js";
import authenticate from "../../middleware/auth.js";

const router = express.Router();

router.get("/users/me", authenticate, async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.status(200).send({'message': user})
    } else {
        res.status(200).send({'message': `user not logged in`})
    }
});

router.post("/users", sanitizeBody, async (req, res, next) => {
  const newUser = new User(req.sanitizedBody);
  await newUser
    .save()
    .then((newUser) =>
      res.status(201).send({ message: "New user created", data: newUser })
    )
    .catch(next);
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

  res.status(201).send({ token: user.generateAuthToken() });
});

export default router;
