import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Nav from '../components/Nav';

const SearchResults = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Filtrer les paramètres vides
        const params = {};
        searchParams.forEach((value, key) => {
          if (value.trim() !== '') {
            params[key] = value;
          }
        });

        const response = await axios.get('http://localhost:8800/api/plants/search', {
          params, // Passer uniquement les paramètres non vides
        });

        setPlants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats de recherche :', error);
        setError('Failed to load search results. Please try again later.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Nav />
      <div className="container mx-auto p-4 mt-24">
        <h2 className="text-2xl font-bold">Résultats de recherche</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
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

export default SearchResults;
