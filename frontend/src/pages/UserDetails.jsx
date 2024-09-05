import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Nav from "../components/Nav";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState([]); // État pour stocker les plantes
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assurez-vous que le token est inclus
            },
            withCredentials: true,
          }
        );
        setUser(response.data);
        fetchUserPlants();
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l'utilisateur :",
          error
        );
        setError("Échec du chargement des détails de l'utilisateur. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPlants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/plants/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        setPlants(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des plantes :", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Nav />
      <div className="max-w-4xl mx-auto mt-40 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="relative md:w-1/3 flex justify-center">
            <img
              src={`http://localhost:8800/${user.profileImage}` || "/default-profile.png"}
              alt="Profil"
              className="w-40 h-40 rounded-full border-4 border-green-500"
            />
          </div>
          <div className="mt-4 md:mt-0 md:ml-8 flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              {user.prenom} {user.nom}
              {user.certification && (
                <FaCheckCircle className=" ml-2" title="Certifié" />
              )}
            </h1>
            <p className="text-gray-600 mb-2">@{user.username}</p>
            <p className="text-gray-500">{user.bio || "Aucune biographie disponible"}</p>
            <p className="text-sm text-gray-600">
              Membre depuis : {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Observations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {plants.length > 0 ? (
              plants.map((plant) => (
                <Link to={`/plants/${plant._id}`} key={plant._id}>
                  <div className="h-40 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-600 p-4 hover:bg-gray-300 transition cursor-pointer">
                    <p className="text-lg font-semibold">{plant.title}</p>
                    <p className="text-sm">{plant.scientificName}</p>
                    <img
                      src={`http://localhost:8800/${plant.photos[0]}` || "/default-plant.png"}
                      alt={plant.title}
                      className="w-20 h-20 mt-2 rounded"
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                Pas d'observation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
