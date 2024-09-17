import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import {
    createReview,
    deleteReview,
    getReview,
    getReviews,
    updateReview,
    getReviewsByUser,
    getReviewsByPlant
} from "../controllers/reviewController.js"

const router = express.Router();
// Créer une Review
router.post("/", verifyUser, createReview); 
// Mettre à jour une Review
router.put("/:id", verifyUser, updateReview); 
// Supprimer une Review
router.delete("/:id", verifyUser, verifyAdmin, deleteReview); 
// Récupérer une Review par son ID
router.get("/id", verifyUser, getReview);
// Récupérer toutes les Reviews
router.get("/", verifyAdmin, getReviews); 
//Recurer les com d'une chambre 
router.get("/plant/:plantId", getReviewsByPlant);


router.get('/user/:userId', verifyUser, getReviewsByUser);
export default router;