import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";

const AdvancedSearch = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.warning("Veuillez sélectionner une image d'abord");
      return;
    }

    const formData = new FormData();
    formData.append("images", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8800/api/identify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      toast.success("Image analysée avec succès !");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 429) {
        toast.error("Trop de requêtes. Veuillez réessayer plus tard.");
      } else {
        toast.error("Une erreur est survenue lors de l'analyse de l'image.");
      }
    }
  };

  return (
    <div>
      <Nav />
      <div className="container mx-auto p-4 mt-24">
        <h2 className="text-2xl font-bold mb-4">Recherche Avancée</h2>
        <p className="mb-6 text-gray-700">
          Utilisez cet outil pour identifier des plantes en téléchargeant une image. 
          Après l'analyse, nous vous fournirons les détails de la plante, y compris le 
          nom, la probabilité de correspondance, et d'autres informations utiles.
        </p>
        <div
          {...getRootProps({
            className:
              "dropzone border-dashed border-2 border-gray-400 p-4 rounded-md",
          })}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <p>Déposez une image ici ou cliquez pour sélectionner une image</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Analyser l'image
        </button>

        {result && result.suggestions && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">Résultats de l'analyse</h3>
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white shadow-md rounded p-4 mb-4">
                <h4 className="text-lg font-semibold">
                  {suggestion.plant_name}
                </h4>
                {suggestion.similar_images &&
                  suggestion.similar_images.length > 0 && (
                    <img
                      src={suggestion.similar_images[0].url}
                      alt={suggestion.plant_name}
                      className="w-full h-auto object-cover mt-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }} // Hide the image if it cannot be loaded
                    />
                  )}
                <p>Probabilité: {(suggestion.probability * 100).toFixed(2)}%</p>
                {suggestion.plant_details && (
                  <div>
                    {suggestion.plant_details.common_names && (
                      <p>
                        Noms communs:{" "}
                        {suggestion.plant_details.common_names.join(", ")}
                      </p>
                    )}
                    {suggestion.plant_details.family && (
                      <p>Famille: {suggestion.plant_details.family}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
