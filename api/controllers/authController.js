import userModel from "../models/userModel.js"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import { createError } from "../utils/error.js"; 

// Fonction d'enregistrement d'un nouvel utilisateur
export const register = async (req, res, next) => {
  try {
    // Génération d'un "salt" (clé de hachage) avec une complexité de 10
    const salt = bcrypt.genSaltSync(10);
    
    // Hachage du mot de passe de l'utilisateur avec le "salt" généré
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Création d'un nouvel objet utilisateur avec les données reçues dans la requête
    const newUser = new userModel({
      username: req.body.username, // Nom d'utilisateur
      email: req.body.email, // Email de l'utilisateur
      password: hash, // Mot de passe haché
      nom: req.body.nom, // Nom de l'utilisateur
      prenom: req.body.prenom, // Prénom de l'utilisateur
      bio: req.body.bio || '', // Biographie de l'utilisateur, par défaut vide si non fournie
      certification: false, // La certification est par défaut à false lors de l'inscription
    });

    // Enregistrement du nouvel utilisateur dans la base de données
    await newUser.save();
    
    // Réponse réussie envoyée au client
    res.status(200).send("User has been created");
  } catch (err) {
    // Gestion des erreurs en appelant le middleware suivant avec l'erreur capturée
    next(err);
  }
};

// Fonction de connexion d'un utilisateur existant
export const login = async (req, res, next) => {
  try {
    // Recherche de l'utilisateur dans la base de données par email
    const user = await userModel.findOne({ email: req.body.email });
    
    // Si l'utilisateur n'est pas trouvé, retourner une erreur 404
    if (!user) return next(createError(404, "User not found!"));

    // Comparaison du mot de passe fourni avec le mot de passe haché stocké
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    // Si le mot de passe est incorrect, retourner une erreur 400
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // Création d'un jeton JWT avec l'ID de l'utilisateur et son statut d'admin
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    
    // Exclusion du mot de passe et du statut admin des détails envoyés dans la réponse
    const { password, isAdmin, ...otherDetails } = user._doc;
    
    // Envoi du jeton d'accès sous forme de cookie avec une option httpOnly
    res.cookie("access_token", token, { httpOnly: true });
    
    // Réponse réussie envoyée au client avec les détails de l'utilisateur (sans le mot de passe)
    res.status(200).json({ ...otherDetails, token });
  } catch (err) {
    // Gestion des erreurs en appelant le middleware suivant avec l'erreur capturée
    next(err);
  }
};
