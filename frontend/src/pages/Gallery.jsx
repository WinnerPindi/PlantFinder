import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import de l'icône de recherche
import Nav from '../components/Nav';
import PlantSearch from '../components/PlantSearch';

const Gallery = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false); // État pour contrôler la visibilité du composant de recherche

  useEffect(() => {
    // Fetch all plants from the backend
    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/plants');
        setPlants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes :', error);
        setError('Failed to load plants. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Nav />
      <div className="container mx-auto p-4 mt-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Galerie de Plantes</h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center text-white bg-green-600 hover:bg-green-700 p-2 rounded"
          >
            <FaSearch className="mr-2" />
            {showSearch ? 'Fermer la Recherche' : 'Rechercher'}
          </button>
        </div>
        {showSearch && <PlantSearch />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Link key={plant._id} to={`/plants/${plant._id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {plant.photos && plant.photos[0] ? (
                  <img
                    src={`http://localhost:8800/${plant.photos[0]}`}
                    alt={plant.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{plant.title}</h3>
                  <p className="text-gray-700 mb-2">{plant.description.substring(0, 100)}...</p>
                  <p className="text-sm text-gray-500">
                    Ajouté par : <Link to={`/user/${plant.user?._id}`} className="text-blue-500 hover:underline">
                      {plant.user ? plant.user.username : 'Utilisateur Inconnu'}
                    </Link>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
