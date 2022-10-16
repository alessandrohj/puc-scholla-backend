import authenticate from "../middleware/auth.js";
import express from "express";
import { Internal, User } from "../models/index.js";
import sanitizeBody from "../middleware/sanitizeBody.js";
import logger from "../startup/logger.js";
import handleError from "../middleware/handleErrors.js";

const router = express.Router();

router.post("/new", authenticate, sanitizeBody, async (req, res, next) => {
  const { hasAccess, school } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    return res.status(400).send({ message: "User doe not have access" });
  }
  if (!school) {
    return res
      .status(400)
      .send({
        message:
          "User not associated with any school. Please contact your school administrator.",
      });
  }
  try {
    const { firstName, lastName, isProfessor, isStudent, schoolId, ...rest } =
      req.sanitizedBody;
    new Internal({
      firstName: firstName,
      lastName: lastName,
      isProfessor: isProfessor,
      isStudent: isStudent,
      school: school,
      schoolId: schoolId,
      ...rest,
    })
      .save()
      .then((newUser) =>
        res
          .status(201)
          .send({ message: "New user added to the system.", data: newUser })
      );
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get("/all", authenticate, async (req, res) => {
  
  const { hasAccess, school } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    return res.status(400).send({ message: "User doe not have access" });
  }
  if (!school) {
    return res
      .status(400)
      .send({
        message:
          "User not associated with any school. Please contact your school administrator.",
      });
  }
  const users = await Internal.find({ school: school }).populate("school");
  res.status(200).send({ data: users });
}); 

router.get("/:role", authenticate, async (req, res) => {
  const { hasAccess, school } = await User.canCreateClass(req.user._id);
  if (!hasAccess || !school) {
    return res.status(400).send({ message: "User doe not have access" });
  }
    const { role } = req.params;

    try {
      const users = await Internal.find({ school: school, role: role });
      res.status(200).send({ data: users });
    } catch (err) {
      logger.error(err)
      handleError(err)
      // next(err)
    }
});

router.get("/:id", authenticate, async (req, res) => {
  const { hasAccess } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    return res.status(400).send({ message: "User doe not have access" });
  }
  try {
    const internalUser = await Internal.findById(req.params.id);
    if (!internalUser) throw new ResourceNotFoundException("Class not found");

    res.status(200).send({ status: "Request completed", data: internalUser });
  } catch (err) {
    logger.error(err);
    handleError(err);
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { hasAccess } = await User.canCreateClass(req.user._id);
  if (!hasAccess) {
    handleError("Unauthorized access");
  }
  try {
    const document = await Internal.findByIdAndDelete(req.params.id);
    if (!document) throw new ResourceNotFoundException("Resource not found");

    res.status(200).send({
      status: "Deleted",
      message: `User ${document.name} was deleted`,
    });
  } catch (err) {
    logger.error(err);
    handleError(err);
  }
});

const update =
  (overwrite = false) =>
  async (req, res) => {
    const { hasAccess } = await User.canCreateClass(req.user._id);
    if (!hasAccess) {
      handleError("Unauthorized access");
    }
    try {
      const document = await Internal.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );
      if (!document) throw new ResourceNotFoundException("User not found");
      res.status(200).send({ message: "User updated", data: document });
    } catch (err) {
      handleError(req, res);
    }
  };
router.put("/:id", authenticate, sanitizeBody, update(true));
router.patch("/:id", authenticate, sanitizeBody, update(false));

export default router;
