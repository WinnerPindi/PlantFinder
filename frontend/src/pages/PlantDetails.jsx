import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Nav";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/plants/${id}`
        );
        setPlant(response.data);

        const commentsResponse = await axios.get(
          `http://localhost:8800/api/review/plant/${id}`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de la plante :",
          error
        );
        setError("Failed to load plant details. Please try again later.");
      }
    };

    fetchPlantDetails();
  }, [id]);

  if (!plant) {
    return <div>Chargement...</div>;
  }

  const plantIcon = L.icon({
    iconUrl: `http://localhost:8800/${plant.photos[0]}`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    shadowUrl: markerShadow,
    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
  });

  // Fonction pour gérer la soumission d'un commentaire
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur connecté
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:8800/api/review`,
        {
          plant: id, // L'ID de la plante
          rating: newRating,
          comment: newComment,
        },
        config
      );

      // Ajouter le nouveau commentaire à la liste sans rafraîchir la page
      setComments([...comments, response.data]);
      setNewComment("");
      setNewRating(0);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className="max-w-screen-lg mx-auto p-8 mt-16">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <img
              src={`http://localhost:8800/${plant.photos[0]}`}
              alt="Main plant view"
              className="w-full h-auto object-cover rounded-lg shadow-lg mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              {plant.photos.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:8800/${image}`}
                  alt={`Plant view ${index + 2}`}
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>
          <div className="md:w-1/3 bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              {plant.title}
            </h1>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Informations sur la Plante
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-semibold">Nom scientifique :</span>{" "}
                  {plant.scientificName}
                </li>
                <li>
                  <span className="font-semibold">Genre :</span> {plant.genus}
                </li>
                <li>
                  <span className="font-semibold">Famille :</span>{" "}
                  {plant.family}
                </li>
                <li>
                  <span className="font-semibold">Statut de conservation :</span>{" "}
                  {plant.conservationStatus}
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Ajouté par
              </h3>
              <Link
                to={`/user/${plant.user?._id}`}
                className="text-blue-500 hover:underline"
              >
                {plant.user ? plant.user.username : "Utilisateur Inconnu"}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed">{plant.description}</p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Localisation
          </h2>
          <div className="h-64 w-full rounded-lg shadow-lg">
            <MapContainer
              center={[
                plant.location.coordinates[1],
                plant.location.coordinates[0],
              ]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[
                  plant.location.coordinates[1],
                  plant.location.coordinates[0],
                ]}
                icon={plantIcon}
              >
                <Popup>{plant.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Commentaires
          </h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-700">{comment.user.prenom} {comment.user.nom}</h3>
                <p className="text-gray-600">{comment.comment}</p>
                <p className="text-gray-500 text-sm">Note : {comment.rating}/5</p>
                <p className="text-gray-400 text-xs">{new Date(comment.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucun commentaire pour cette plante.</p>
          )}
        </div>

        {/* Formulaire pour ajouter un commentaire */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ajouter un Commentaire
          </h2>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label htmlFor="rating" className="block text-gray-700 font-semibold">
                Note (sur 5)
              </label>
              <input
                id="rating"
                type="number"
                min="0"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="comment" className="block text-gray-700 font-semibold">
                Commentaire
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Ajout en cours..." : "Ajouter Commentaire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
