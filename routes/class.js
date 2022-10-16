import authenticate from "../middleware/auth.js";
import express from "express";
import { User, Class } from "../models/index.js";
import sanitizeBody from "../middleware/sanitizeBody.js";
import logger from "../startup/logger.js";
// import handleError from "../middleware/handleErrors.js";
import ResourceNotFoundException from "../middleware/exceptions/ResourceNotFoundException.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const { hasAccess } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    return res.status(400).send({ message: "User doe not have access" });
  }
  await Class.find({}).then((classList) =>
    res.status(200).send({ data: classList })
  );
});

router.post("/new", authenticate, sanitizeBody, async (req, res) => {
  const { user, hasAccess } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    // handleError("Unauthorized access");
  }
  try {
    const newClass = new Class(req.sanitizedBody);
    newClass.createdBy = user;
    await newClass.save();
    res.status(201).send({ message: "New class created", data: newClass });
  } catch (err) {
    logger.error(err);
    // handleError(err);
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const currentClass = await Class.findById(req.params.id);
    if (!currentClass) throw new ResourceNotFoundException("Class not found");

    res.status(200).send({ status: "Request completed", data: currentClass });
  } catch (err) {
    logger.error(err);
    // handleError(err);
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { hasAccess } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    // handleError("Unauthorized access");
  }
  try {
    const document = await Class.findByIdAndDelete(req.params.id);
    if (!document) throw new ResourceNotFoundException("Resource not found");

    res
      .status(200)
      .send({
        status: "Deleted",
        message: `Class ${document.name} was deleted`,
      });
  } catch (err) {
    logger.error(err);
    // handleError(err);
  }
});

const update =
  (overwrite = false) =>
  async (req, res) => {
    const { hasAccess } = await User.canCreateClass(req.user._id);
    if (!hasAccess) {
      // handleError("Unauthorized access");
    }
    try {
      const document = await Class.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );
      if (!document) throw new ResourceNotFoundException("Class not found");
      res.status(200).send({ message: "Class updated", data: document });
    } catch (err) {
      // handleError(req, res);
    }
  };
router.put("/:id", authenticate, sanitizeBody, update(true));
router.patch("/:id", authenticate, sanitizeBody, update(false));

export default router;
