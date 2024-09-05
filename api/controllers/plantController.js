import PlantModel from "../models/plantModel.js";

// CREATE
export const createPlant = async (req, res) => {
  const {
    title,
    scientificName,
    family,
    genus,
    conservationStatus,
    description,
    longitude,
    latitude,
  } = req.body;

  if (!title || !scientificName || !family || !genus || !description) {
    return res
      .status(400)
      .json({
        message:
          "Title, scientific name, family, genus, and description are required.",
      });
  }

  const photos = req.files ? req.files.map((file) => file.path) : []; // Obtenir les chemins des fichiers

  if (photos.length > 5) {
    return res
      .status(400)
      .json({ message: "A plant can have at most 5 photos." });
  }

  const newPlant = new PlantModel({
    title,
    scientificName,
    family,
    genus,
    conservationStatus,
    description,
    photos,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    user: req.user.id, // Assurez-vous que req.user.id est défini via votre middleware d'authentification
  });

  try {
    const savedPlant = await newPlant.save();
    res.status(200).json(savedPlant);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la plante", err });
  }
};

// UPDATE
export const updatePlant = async (req, res) => {
  const {
    title,
    scientificName,
    family,
    genus,
    conservationStatus,
    description,
    longitude,
    latitude,
  } = req.body;

  if (req.files && req.files.length > 5) {
    return res
      .status(400)
      .json({ message: "A plant can have at most 5 photos." });
  }

  try {
    const updatedPlant = await PlantModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          scientificName,
          family,
          genus,
          conservationStatus,
          description,
          photos: req.files ? req.files.map((file) => file.path) : [],
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: "Plante non trouvée" });
    }

    res.status(200).json(updatedPlant);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la plante", err });
  }
};

// DELETE
export const deletePlant = async (req, res) => {
  try {
    const deletedPlant = await PlantModel.findByIdAndDelete(req.params.id);

    if (!deletedPlant) {
      return res.status(404).json({ message: "Plante non trouvée" });
    }

    res.status(200).json({ message: "Plante supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la plante", err });
  }
};

// GET
export const getPlant = async (req, res) => {
  try {
    const plant = await PlantModel.findById(req.params.id).populate('user', 'username email');;

    if (!plant) {
      return res.status(404).json({ message: "Plante non trouvée" });
    }

    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de la plante", err });
  }
};


// GET ALL
export const getAllPlants = async (req, res) => {
  try {
    const plants = await PlantModel.find().populate('user', 'username email');
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des plantes", err });
  }
};

// SEARCH
export const searchPlants = async (req, res) => {
  try {
    const { title, scientificName, family } = req.query;

    // Créer un filtre basé sur les critères de recherche
    let filter = {};

    if (title && title.trim() !== '') {
      filter.title = { $regex: new RegExp(title, "i") }; // Rechercher par titre
    }
    if (scientificName && scientificName.trim() !== '') {
      filter.scientificName = { $regex: new RegExp(scientificName, "i") }; // Rechercher par nom scientifique
    }
    if (family && family.trim() !== '') {
      filter.family = { $regex: new RegExp(family, "i") }; // Rechercher par famille
    }

    // Si aucun critère n'est fourni, retourner une erreur
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: "Veuillez fournir au moins un critère de recherche valide." });
    }

    // Effectuer la recherche
    const plants = await PlantModel.find(filter).populate('user', 'username email');

    if (plants.length === 0) {
      return res.status(404).json({ message: "Aucune plante ne correspond aux critères de recherche." });
    }

    // Retourner les résultats de recherche
    res.status(200).json(plants);
  } catch (err) {
    console.error('Erreur lors de la recherche des plantes:', err);
    res.status(500).json({ message: "Erreur lors de la recherche des plantes", error: err.message });
  }
};





// GET PLANTS BY USER
export const getPlantsByUser = async (req, res) => {
  const userId = req.params.userId; // Récupère l'identifiant de l'utilisateur à partir des paramètres d'URL

  try {
    const plants = await PlantModel.find({ user: userId }).populate('user', 'username email');
    
    if (plants.length === 0) {
      return res.status(404).json({ message: "Pas d'observations pour cet utilisateur" });
    }

    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des plantes pour cet utilisateur", err });
  }
};

