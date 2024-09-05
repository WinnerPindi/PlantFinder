import express from 'express'; 
import dotenv from 'dotenv'; 
import mongoose from 'mongoose'; 
import authRoute from './routes/authRoute.js'; 
import usersRoute from './routes/usersRoute.js'; 
import plantsRoute from './routes/plantsRoute.js'; 
import cookieParser from 'cookie-parser'; 
import cors from 'cors'; 
import multer from 'multer'; 
import https from 'https'; 
import FormData from 'form-data'; 

dotenv.config(); // Chargement des variables d'environnement à partir du fichier .env
const app = express(); // Création d'une instance d'Express

// Configuration de CORS pour autoriser les requêtes provenant de http://localhost:5173
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// Fonction pour connecter l'application à MongoDB
const connect = async () => {
  try {
    // Connexion à MongoDB en utilisant la chaîne de connexion stockée dans l'environnement
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB."); // Message de succès si la connexion réussit
  } catch (error) {
    console.error("Failed to connect to MongoDB", error); // Message d'erreur si la connexion échoue
    throw error; // Relance de l'erreur pour une gestion ultérieure
  }
};

// Configuration de multer pour la gestion des téléchargements de fichiers
const upload = multer();

// Route de test pour vérifier que le serveur est fonctionnel
app.get("/", (req, res) => {
  res.send("Hello first request!"); // Réponse simple à une requête GET sur la route racine
});

// Route POST pour identifier une plante en envoyant une image à l'API Plant.id
app.post('/api/identify', upload.single('images'), async (req, res) => {
  try {
    const form = new FormData(); // Création d'un nouvel objet FormData
    form.append('images', req.file.buffer, req.file.originalname); // Ajout de l'image téléchargée au formulaire

    const options = {
      method: 'POST', // Méthode POST pour envoyer la requête
      headers: {
        ...form.getHeaders(), // Inclusion des en-têtes du formulaire
        'Api-Key': process.env.PLANT_ID_API_KEY, // Ajout de la clé API pour authentifier la requête
      },
    };

    // Envoi de la requête à l'API Plant.id
    const request = https.request('https://api.plant.id/v2/identify', options, (response) => {
      let data = ''; // Variable pour stocker la réponse

      response.on('data', (chunk) => {
        data += chunk; // Accumulation des morceaux de réponse
      });

      response.on('end', () => {
        res.json(JSON.parse(data)); // Envoi de la réponse finale au client sous forme JSON
      });
    });

    request.on('error', (error) => {
      console.error(error); // Gestion des erreurs de requête
      res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' }); // Envoi d'une réponse d'erreur au client
    });

    form.pipe(request); // Envoi des données du formulaire avec la requête
  } catch (error) {
    console.error(error); // Gestion des erreurs générales
    res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' }); // Envoi d'une réponse d'erreur au client
  }
});

// Middlewares
app.use(cookieParser()); // les cookies
app.use(express.json()); // les requêtes JSON
app.use("/uploads", express.static("uploads")); 

// Routes d'API
app.use("/api/auth", authRoute); 
app.use("/api/users", usersRoute); 
app.use("/api/plants", plantsRoute); 

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500; // Statut d'erreur par défaut à 500
  const errorMessage = err.message || "Something went wrong"; // Message d'erreur par défaut
  return res.status(errorStatus).json({
    success: false, // Indique que la requête a échoué
    status: errorStatus, // Statut d'erreur
    message: errorMessage, // Message d'erreur
    stack: err.stack, // Pile d'appel pour le débogage
  });
});

// Démarrage du serveur sur le port 8800
app.listen(8800, () => {
  connect(); // Connexion à MongoDB lors du démarrage du serveur
  console.log("Connected to backend"); // Message de confirmation
});
