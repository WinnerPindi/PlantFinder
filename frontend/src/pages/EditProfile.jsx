import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserDetails } from "../redux/slice/authSlice";
import Nav from "../components/Nav";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    nom: currentUser?.nom || "",
    prenom: currentUser?.prenom || "",
    bio: currentUser?.bio || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.error("Utilisateur non connecté");
      return;
    }
    try {
      await dispatch(updateUserDetails({ id: currentUser._id, ...formData })).unwrap();
      navigate("/userprofil/" + currentUser._id);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="max-w-2xl mx-auto mt-40 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Modifier le Profil
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nom"
              className="block text-gray-700 font-semibold mb-2"
            >
              Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="prenom"
              className="block text-gray-700 font-semibold mb-2"
            >
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="bio"
              className="block text-gray-700 font-semibold mb-2"
            >
              Biographie
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows="4"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
