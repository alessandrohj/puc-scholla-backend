import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import sanitizeBody from "../../middleware/sanitizeBody.js";

const saltRounds = 14;

const router = express.Router();

router.get("/users/me", async (req, res) => {
  //Route in testing mode with DB.
  //Need to implement proper authentication
});

router.post("/users", sanitizeBody, async (req, res, next) => {
  const newUser = new User(req.sanitizedBody);
  newUser.password = await bcrypt.hash(newUser.password, saltRounds);
  await newUser
    .save()
    .then((newUser) =>
      res.status(201).send({ message: "New user created", data: newUser })
    )
    .catch(next);
});

router.post("/tokens", sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody;
  const user = await User.findOne({ email: email });
  const badHash = `$2b$${saltRounds}$invalid@U#erj23IRUJQNFI324OK4`;
  const hashedPassword = user ? user.password : badHash;
  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  if (!user || !passwordMatch) {
    return res.status(401).send({ message: "Not authorized" });
  }
  const accessToken = "iamatoken";
  res.status(201).json({ token: { accessToken } });
});

export default router;
