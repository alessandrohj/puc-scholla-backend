import express from 'express';
import { User, School } from '../models/index.js';
import authenticate from '../middleware/auth.js';


const router = express.Router();

router.get("/list", async (req, res) => {
    await School.find({}).then((schoolList) =>
      res.status(200).send({ data: schoolList })
    );
  });

  router.get("/:name", async (req, res) => {
    const { name } = req.params;
      await School.find({ name: {"$regex": name, "$options": "i"} }).then((school) =>
      res.status(200).send({ data: school })
    );
  })


router.get("/admin/:id", authenticate, async (req, res) => {
  const {hasAccess} = await User.hasTotalAccess(req.user._id);
  if (!hasAccess) {
    res.status(404).send({ message: "No access" });
  } else {
    const { id } = req.params;
    await School.findOne({ _id: id }).populate('admins').populate('professors').populate('dean').then((school) =>
      res.status(200).send({ data: school })
    )};
  })

export default router;