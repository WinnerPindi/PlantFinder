import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import { promisify } from "util";
import UserModel from "../models/UserModel.js";

// Middleware pour vérifier si le token JWT est présent et valide
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]; // Récupère le token du cookie ou de l'en-tête d'autorisation
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Utiliser JWT_SECRET ici
    if (err) {
      return next(createError(401, "Token is not valid!"));
    }
    req.user = user; // Stocke les infos de l'utilisateur dans l'objet requête
    console.log(req.user);
    next();
  });
};

// Middleware pour vérifier l'identité de l'utilisateur
export const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1]; // Récupère le token du cookie ou de l'en-tête d'autorisation

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Utiliser JWT_SECRET ici
  } catch (error) {
    return next(createError(401, "Token is not valid!"));
  }

  // Récupération de l'utilisateur à partir de l'ID contenu dans le token
  const freshUser = await UserModel.findById(decoded.id);

  if (!freshUser) {
    // Si aucun utilisateur correspondant n'est trouvé
    return next(createError(401, "You are not authenticated!"));
  }

  req.user = freshUser;
  next();
};

// Middleware pour vérifier si l'utilisateur est un administrateur
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // Après que verifyToken ait appelé next(), ce code est exécuté.
    if (req.user && req.user.isAdmin) {
      next(); // L'utilisateur est authentifié et autorisé, continuer.
    } else {
      next(createError(403, "You are not authorized")); // L'utilisateur n'est pas autorisé.
    }
  });
};

export const updateUserProfileImage = async (req, res, next) => {
  try {
    // Vérifier si une image a été téléchargée
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Récupérer l'URL de l'image téléchargée
    const imageUrl = req.file.path;

    // Mettre à jour l'utilisateur avec l'URL de l'image
    req.user.profileImage = imageUrl;
    await req.user.save();

    // Répondre avec succès
    res
      .status(200)
      .json({ message: "Profile image updated successfully", imageUrl });
  } catch (error) {
    // Gérer les erreurs
    console.error("Error updating profile image:", error);
    next(error);
  }
};

// Middleware pour authentifier un token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Non autorisé
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Erreur de vérification du token:", err);
      return res.sendStatus(403); // Interdit
    }
    console.log("Utilisateur authentifié:", user);
    req.user = user; // Stocke l'utilisateur dans la requête
    next();
  });
};
