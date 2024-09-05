import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";

const AddObservation = () => {
  const [title, setTitle] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [family, setFamily] = useState("");
  const [genus, setGenus] = useState("");
  const [conservationStatus, setConservationStatus] = useState("");
  const [description, setDescription] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);

  const handlePhotoChange = (event) => {
    setPhotos(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !scientificName || !family || !genus || !description) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("scientificName", scientificName);
    formData.append("family", family);
    formData.append("genus", genus);
    formData.append("conservationStatus", conservationStatus);
    formData.append("description", description);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    Array.from(photos).forEach((photo) => formData.append("photos", photo));

    try {
      const response = await axios.post(
        "http://localhost:8800/api/plants",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser.token}`, // Assurez-vous que le token est inclus
          },
        }
      );
      console.log("Observation ajoutée avec succès:", response.data);
      setSuccess(true); // Marque le succès pour afficher le lien
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'observation :", error);
      setError("Erreur lors de l'ajout de l'observation. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="max-w-4xl mx-auto mt-40 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajouter une Observation</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && (
          <div className="text-green-600 mb-4">
            Observation ajoutée avec succès!{" "}
            <Link to={`/user/${currentUser._id}`} className="text-blue-500 underline">
              Retourner au profil
            </Link>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom Scientifique
              </label>
              <input
                type="text"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Famille
              </label>
              <input
                type="text"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <input
                type="text"
                value={genus}
                onChange={(e) => setGenus(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut de Conservation
              </label>
              <select
                value={conservationStatus}
                onChange={(e) => setConservationStatus(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un statut</option>
                <option value="Least Concern">Préoccupation Mineure</option>
                <option value="Near Threatened">Quasi Menacé</option>
                <option value="Vulnerable">Vulnérable</option>
                <option value="Endangered">En Danger</option>
                <option value="Critically Endangered">En Danger Critique</option>
                <option value="Extinct">Éteint</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photos (max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Ajouter l'Observation
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddObservation;
