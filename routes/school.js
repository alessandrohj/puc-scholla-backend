import authenticate from '../middleware/auth.js';
import express from 'express';
import logger from '../startup/logger.js';
import sanitizeBody from '../middleware/sanitizeBody.js';
import handleError from "../middleware/handleErrors.js";
import { User, School } from '../models/index.js';


const router = express.Router();

router.post('/', authenticate, sanitizeBody, async (req, res) => {
 const {user, hasAccess} = await User.hasTotalAccess(req.user._id)
 if (!hasAccess) {
  //  handleError("Unauthorized access");
  res.status(404).send({ message: "No access to create schools" });
 }
 try {
   const newSchool = new School(req.sanitizedBody);
   newSchool.createdBy = user;
   await newSchool.save();
   res.status(201).send({ message: "New school created", data: newSchool });
 } catch (err) {
   logger.error(err);
   handleError(err);
 }
});

router.get("/list", async (req, res) => {
    await School.find({}).then((schoolList) =>
      res.status(200).send({ data: schoolList })
    );
  });

  router.get("/:name", async (req, res) => {
    const { name } = req.params;
    console.log(name)
      await School.find({ name: {"$regex": name, "$options": "i"} }).then((schools) =>
      res.status(200).send({ data: schools })
    );
  })

router.delete("/:id", authenticate, async (req, res) => {
    const { hasAccess } = await User.hasTotalAccess(req.user._id);
    if (!hasAccess) {
      handleError("Unauthorized access");
    }
    try {
      const document = await School.findByIdAndDelete(req.params.id);
      if (!document) throw new ResourceNotFoundException("Resource not found");
  
      res
        .status(200)
        .send({
          status: "Deleted",
          message: `School ${document.name} was deleted`,
        });
    } catch (err) {
      logger.error(err);
      handleError(err);
    }
  });


  const update =
  (overwrite = false) =>
  async (req, res) => {
    const { hasAccess } = await User.hasTotalAccess(req.user._id);
    if (!hasAccess) {
      handleError("Unauthorized access");
    }
    try {
      const document = await School.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );
      if (!document) throw new ResourceNotFoundException("School not found");
      res.status(200).send({ message: "School updated", data: document });
    } catch (err) {
      handleError(req, res);
    }
  };
router.put("/:id", authenticate, sanitizeBody, update(true));
router.patch("/:id", authenticate, sanitizeBody, update(false));

export default router;