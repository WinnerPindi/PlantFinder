import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Remplacer useHistory par useNavigate

const PlantSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    title: '',
    scientificName: '',
    family: '',
    genus: '',
    conservationStatus: '',
  });

  const navigate = useNavigate(); // Utiliser useNavigate

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Vérification si au moins un critère est fourni
    if (Object.values(searchCriteria).every((value) => !value.trim())) {
      alert('Veuillez remplir au moins un critère de recherche.');
      return;
    }

    // Rediriger vers la nouvelle page de résultats de recherche avec les critères
    const queryParams = new URLSearchParams(searchCriteria).toString();
    navigate(`/search?${queryParams}`); // Utiliser navigate à la place de history.push
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recherche de Plantes</h1>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-gray-700">Nom commun</label>
          <input
            type="text"
            name="title"
            id="title"
            value={searchCriteria.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nom commun"
          />
        </div>
        <div>
          <label htmlFor="scientificName" className="block text-gray-700">Nom scientifique</label>
          <input
            type="text"
            name="scientificName"
            id="scientificName"
            value={searchCriteria.scientificName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nom scientifique"
          />
        </div>
        <div>
          <label htmlFor="family" className="block text-gray-700">Famille</label>
          <input
            type="text"
            name="family"
            id="family"
            value={searchCriteria.family}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Famille"
          />
        </div>
  
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded mt-4 lg:col-span-3"
        >
          Rechercher
        </button>
      </form>
    </div>
  );
};

export default PlantSearch;
