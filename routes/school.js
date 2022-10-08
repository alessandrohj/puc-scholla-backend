import authenticate from '../middleware/auth.js';
import express from 'express';
import logger from '../startup/logger.js';
import sanitizeBody from '../middleware/sanitizeBody.js';
import handleError from "../middleware/handleErrors.js";
import { User, School } from '../models/index.js';


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


router.get("/:id", async (req, res) => {
    const { id } = req.params;
      await School.findById(id).then((school) =>
      res.status(200).send({ data: school })
    );
  })

export default router;