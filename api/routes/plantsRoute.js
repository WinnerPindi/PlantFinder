import express from "express";
import { 
  createPlant, 
  deletePlant, 
  getAllPlants, 
  getPlant, 
  updatePlant, 
  searchPlants, 
  getPlantsByUser 
} from "../controllers/plantController.js";
import { verifyUser } from "../utils/verifyToken.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// CREATE
router.post("/", verifyUser, upload.array("photos", 5), createPlant);

// UPDATE
router.put("/:id", verifyUser, upload.array("photos", 5), updatePlant);

// DELETE
router.delete("/:id", verifyUser, deletePlant);

// GET ALL
router.get("/", getAllPlants);

// SEARCH 
router.get("/search", searchPlants);

// GET PLANTS BY USER 
router.get("/user/:userId", getPlantsByUser);

// GET BY ID 
router.get("/:id", getPlant);

export default router;
