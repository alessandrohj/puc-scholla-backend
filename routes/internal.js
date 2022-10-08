import authenticate from "../middleware/auth.js";
import express from "express";
import { Internal, User } from "../models/index.js";
import sanitizeBody from "../middleware/sanitizeBody.js";

const router = express.Router()


router.post("/new", authenticate, sanitizeBody, async (req, res, next) => {
    const { hasAccess } = await User.canCreateClass(req.user._id);
    if (!hasAccess) {
      return res.status(400).send({ message: "User doe not have access" });
    }
    try {
        new Internal(req.sanitizedBody)
        .save()
        .then((newUser) =>
        res.status(201).send({ message: "New user added to the system.", data: newUser })
      )

    } catch(err) {
        logger.error(err)
        next(err)
    }
})

router.get("/", authenticate, sanitizeBody, async (req, res) => {
    const { hasAccess } = await User.canCreateClass(req.user._id);
    if (!hasAccess) {
      return res.status(400).send({ message: "User doe not have access" });
    }
    await Internal.find({}).then((internalUsers) =>
      res.status(200).send({ data: internalUsers })
    );
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
  
      res
        .status(200)
        .send({
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


export default router