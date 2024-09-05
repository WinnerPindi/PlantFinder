import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Nav";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Importer les icônes de Leaflet en utilisant les imports ESModules
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configurer les options par défaut pour les icônes de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/plants/${id}`
        );
        setPlant(response.data);
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

  // Créez une icône personnalisée pour la carte en utilisant l'image de la plante
  const plantIcon = L.icon({
    iconUrl: `http://localhost:8800/${plant.photos[0]}`,
    iconSize: [50, 50], // Taille de l'icône
    iconAnchor: [25, 50], // Point d'ancrage pour centrer l'icône
    popupAnchor: [0, -50], // Point d'ancrage pour le popup
    shadowUrl: markerShadow,
    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
  });

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
      </div>
    </div>
  );
};

export default PlantDetails;
