import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    prenom: "",
    nom: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        formData
      );

      console.log(response.data);
      toast.success("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      toast.error("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <section className="flex flex-wrap h-screen items-center justify-center bg-gradient-to-br from-green-900 to-17201b">
      <div className="w-full max-w-md px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl text-green-900">
            Inscription à PlantFinder
          </h1>

          <p className="mt-4 text-gray-600">
            Rejoignez notre communauté pour explorer et partager vos découvertes
            sur les plantes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-0 mt-8 max-w-md space-y-6"
        >
          <div>
            <label htmlFor="prenom" className="sr-only">
              Prénom
            </label>

            <div className="relative">
              <input
                type="text"
                name="prenom"
                id="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm"
                placeholder="Entrez votre prénom"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="nom" className="sr-only">
              Nom
            </label>

            <div className="relative">
              <input
                type="text"
                name="nom"
                id="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm"
                placeholder="Entrez votre nom"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="sr-only">
              Nom d'utilisateur
            </label>

            <div className="relative">
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm"
                placeholder="Entrez votre email"
                required
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm"
                placeholder="Entrez votre mot de passe"
                required
              />

              <span
                className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  )}
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="inline-block w-full lg:w-auto rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700"
          >
            S'inscrire
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-700 hover:underline">
            Déjà un compte? Connectez-vous
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
