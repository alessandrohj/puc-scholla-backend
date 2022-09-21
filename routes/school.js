import authenticate from '../middleware/auth.js';
import express from 'express';
import logger from '../startup/logger';
import sanitizeBody from '../middleware/sanitizeBody.js';
import { User, School } from '../models/index.js';


const router = express.Router();

router.post('/list', authenticate, sanitizeBody, async (req, res) => {
 const {user, hasAccess} = await User.hasTotalAccess(req.user._id)
 if (!hasAccess) {
   handleError("Unauthorized access");
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

router.get("/", async (req, res) => {
    await School.find({}).then((schoolList) =>
      res.status(200).send({ data: schoolList })
    );
  });

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