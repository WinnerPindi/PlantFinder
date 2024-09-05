import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlice';
import { RxHamburgerMenu } from "react-icons/rx";
import Logo from "../assets/Logo.png";
import axios from 'axios';

const Nav = ({userT}) => {

  const [isMobileMenuShown, setIsMobileMenuShown] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth); 
  const [currentUser, setCurrentUser] = useState({profileImage:null});  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const fetchUser = async () => {
    if (!user._id) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8800/api/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // le token 
          },
          withCredentials: true,
        }
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
    } 
  };
  useEffect ( () => {
    fetchUser();
  }, [userT])

  console.log(currentUser);
  return (
    <nav className="fixed top-0 left-0 w-full z-10 bg-black shadow-md">
      <div className="container mx-auto px-2 py-4 flex justify-between items-center">
        {/* Logo et Nom de l'application */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-12 w-12" />
            <span className="text-xl font-bold text-white ml-2">PlantFinder</span>
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <button
          onClick={() => setIsMobileMenuShown(!isMobileMenuShown)}
          className="lg:hidden rounded-lg hover:bg-gray-800 p-2 focus:ring-2 focus:ring-gray-800"
        >
          <RxHamburgerMenu size={25} />
        </button>

        {/* Menu de Navigation */}
        <div
          className={`flex-col lg:flex-row items-center ${isMobileMenuShown ? 'flex' : 'hidden'} lg:flex lg:space-x-8 bg-black text-lg rounded-lg lg:border-none p-4 lg:p-0`}
        >
          {/* Lien pour Galeries et Recherche Avancée */}
          <div className="flex-grow lg:flex lg:items-center lg:space-x-8">
            <Link to="/gallery" className="transition-colors duration-300 text-white hover:text-gray-400">Galeries</Link>
            <Link to="/advanced-search" className="transition-colors duration-300 text-white hover:text-gray-400">Recherche Avancée</Link>
          </div>

          {/* Profil Utilisateur ou Connexion */}
          {user ? (
            <div className="relative">
              <img
                src={user.profileImage ? `http://localhost:8800/${currentUser.profileImage}` : '/default-profile.png'}
                alt="Profil"
                className="h-10 w-10 rounded-full cursor-pointer border-2 border-white"
                onClick={toggleProfileMenu}
              />
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <Link to={`/userprofil/${user._id}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="transition-colors duration-300 text-white hover:text-gray-400">Connexion</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
