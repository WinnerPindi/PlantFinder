import { AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-17201b  text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-extrabold mb-4">Contactez-nous</h2>
            <p>Email: win.pindi@gmail.com</p>
          </div>
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-extrabold mb-4">Liens utiles</h2>
            <ul className="space-y-2">
              <li>
                <a href="/gallery" className="hover:underline">
                  Gallerie
                </a>
              </li>
              <li>
                <a href="/advanced-search" className="hover:underline">
                  Recherche Avancée
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Connexion
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold mb-4">Suivez-nous</h2>
            <ul className="flex justify-center md:justify-start space-x-6">
              <li>
                <a
                  href="https://www.linkedin.com/in/winner-pindi-768400235/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <AiFillLinkedin size="30" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/winner_p78/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400"
                >
                  <AiFillInstagram size="30" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <FaFacebook size="30" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 border-t border-green-800 pt-6">
          <p>&copy; 2023 PlantFinder. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

