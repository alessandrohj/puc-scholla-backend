import authenticate from "./../middleware/auth.js";
import express from "express";
import logger from "../startup/logger.js";
import sanitizeBody from "../middleware/sanitizeBody.js";
// import handleError from "../middleware/handleErrors.js";
import { User, School } from "../models/index.js";

const router = express.Router();

router.post("/users", sanitizeBody, authenticate, async (req, res, next) => {
  logger.error(req.user)
    const { hasAccess } = await User.hasTotalAccess(req.user._id);
    if (!hasAccess) {
      res.status(404).send({ message: "No access to create admins" });
    } else {
    try {
      new User(req.sanitizedBody)
      .save()
      .then((newUser) =>
        res.status(201).send({ message: "New user created", data: newUser })
      )
    } catch (err) {
      logger.error(err)
      res.status(400).send({ message: err.message })
      next(err)
    }
  }
  });

  router.get("/users", authenticate, async (req, res) => {
    const { hasAccess } = await User.hasTotalAccess(req.user._id);
    if (!hasAccess) {
      res.status(404).send({ message: "No access" });
    } else {
      await User.find().populate('school').then((users) => {
        if (!users) {
          res.status(404).send({ message: "No users found" });
        } else {
          res.status(200).send({ data: users });
        }
      });
    }});

    router.get("/users/role/:role/:name", authenticate, async (req, res) => {
      const { hasAccess } = await User.hasTotalAccess(req.user._id);
      if (!hasAccess) {
        res.status(404).send({ message: "No access" });
      } else {
        await User.find().populate('school').then((users) => {
          if (!users) {
            res.status(404).send({ message: "No users found" });
          } else {
            const { role, name } = req.params;
            const filteredUsers = users.filter((user) => {
              if (user.role === role){
                return user.firstName.toLowerCase().includes(name.toLowerCase()) || user.email.toLowerCase().includes(name.toLowerCase()) || user.lastName.toLowerCase().includes(name.toLowerCase())
              }
            })
            res.status(200).send({ data: filteredUsers });
          }
        }
        );
      }});

    router.get("/users/:query", authenticate, async (req, res) => {
      const { hasAccess } = await User.hasTotalAccess(req.user._id);
      if (!hasAccess) {
        res.status(404).send({ message: "No access" });
      } else {
        await User.find().populate('school').then((users) => {
          if (!users) {
            res.status(404).send({ message: "No users found" });
          } else {
            const { query } = req.params;
            const filteredUsers = users.filter((user) => {
              if (user.role === "admin" || user.role === "super" || user.role === "dean"){
                return user.firstName.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()) || user.lastName.toLowerCase().includes(query.toLowerCase())
              }
            })
            res.status(200).send({ data: filteredUsers });
          }
        }
        );
      }});

      router.get("/users/details/:email", authenticate, async (req, res) => {
        const { hasAccess } = await User.hasTotalAccess(req.user._id);
        if (!hasAccess) {
          res.status(404).send({ message: "No access" });
        } else {
          const { email } = req.params;
          await
          User.findOne({ email: {"$regex": email, "$options": "i"} }).populate('school').then((user) => {
            if (!user) {
              res.status(404).send({ message: "User not found" });
            } else {
              res.status(200).send({ data: user });
            }
          }
        )
      }});

      router.delete("/users/:email", authenticate, async (req, res) => {
        const { hasAccess } = await User.hasTotalAccess(req.user._id);
        if (!hasAccess) {
          res.status(404).send({ message: "No access" });
        } else {
          const { email } = req.params;
          await User.findOneAndDelete({ email: {"$regex": email, "$options": "i"} }).then((user) => {
            if (!user) {
              res.status(404).send({ message: "User not found" });
            } else {
              res.status(200).send({ message: "User deleted", data: user });
            }
          });
        }});


  router.patch("/users/:email", sanitizeBody, authenticate, async (req, res, next) => {
    const { hasAccess } = await User.hasTotalAccess(req.user._id);
    if (!hasAccess) {
      res.status(404).send({ message: "No access." });
    } else {

      try {
        const {email} = req.params;
        const {...data } = req.sanitizedBody;
        const user = await User.findOneAndUpdate({email}, data, {new: true})
        res.status(200).send({message: "User updated", data: user})
      } catch (err) {
        logger.error(err)
        next(err)
      }
    }
  });


    // School
    router.post('/school', authenticate, sanitizeBody, async (req, res) => {
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
        // handleError(err);
      }
     });


    router.delete("/school/:id", authenticate, async (req, res) => {
      const { hasAccess } = await User.hasTotalAccess(req.user._id);
      if (!hasAccess) {
        // handleError("Unauthorized access");
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
        // handleError(err);
      }
    });


    // const update =
    // (overwrite = false) =>
    // async (req, res) => {
    //   const { hasAccess } = await User.hasTotalAccess(req.user._id);
    //   if (!hasAccess) {
    //     res.status(404).send({ message: "No access" });
    //   }
    //   try {
    //     const document = await School.findByIdAndUpdate(
    //       req.params.id,
    //       req.sanitizedBody,
    //       {
    //         new: true,
    //         overwrite,
    //         runValidators: true,
    //       }
    //     );
    //     if (!document) throw new ResourceNotFoundException("School not found");
    //     res.status(200).send({ message: "School updated", data: document });
    //   } catch (err) {
    //     // handleError(req, res);
    //   }
    // };
  router.patch("/school/:id", authenticate, sanitizeBody, async (req, res) => {
    const { hasAccess } = await User.hasTotalAccess(req.user._id);
    if (!hasAccess) {
      res.status(404).send({ message: "No access" });
    }
   const {id} = req.params;
    const {dean, name} = req.sanitizedBody;
    const doc = await School.findById(id)
    logger.info(doc)
    if (dean) {
      doc.dean = dean;
    }
    if (name) {
      doc.name = name;
    }
    await doc.save().then(savedDoc => {
      res.status(200).send({ message: "School updated", data: savedDoc });
    }).catch(err => {
      logger.error(err)
      res.status(500).send({ message: "Error updating school", data: err });
    }
    )
  });

    export default router;