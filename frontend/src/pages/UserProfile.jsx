import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaCamera } from "react-icons/fa";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState([]); // État pour stocker les plantes
  const fileInputRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?._id;

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await axios.put(
          `http://localhost:8800/api/users/profileImage/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log("Image uploaded successfully:", response.data);
        fetchUser();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const fetchUser = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8800/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          withCredentials: true,
        }
      );
      setUser(response.data);
      fetchUserPlants(); // Fetch plants after getting user data
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
    }
  };

  const fetchUserPlants = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/plants/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          withCredentials: true,
        }
      );
      setPlants(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des plantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-600">
        Utilisateur non trouvé.
      </div>
    );
  }

  return (
    <div>
      <Nav userT={user} />
      <div className="max-w-4xl mx-auto mt-40 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="relative md:w-1/3 flex justify-center">
            <img
              src={`http://localhost:8800/${user.profileImage}` || "/default-profile.png"}
              alt="Profil"
              className="w-40 h-40 rounded-full border-4 border-green-500"
            />
            <FaCamera
              className="absolute bottom-0 right-0 cursor-pointer text-xl text-primary"
              onClick={handleFileInputClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
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

        <div className="mt-10 ml-14">
          <Link
            to="/edit-profile"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Modifier le Profil
          </Link>
          <Link
            to="/add-obersation"
            className="ml-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter une observation
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Observations
          </h2>
          {/* Section pour afficher les plantes de l'utilisateur */}
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

export default UserProfile;
