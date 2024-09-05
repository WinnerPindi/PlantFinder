import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(credentials));
      if (response.type === "auth/login/rejected") {
        toast.warning(response.payload?.stack || "Une erreur est survenue");
      } else {
        toast.success("Connexion réussie !");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <section className="flex flex-wrap h-screen items-center justify-center bg-gradient-to-br from-green-900 to-17201b">
      <div className="w-full max-w-md px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl text-green-900">
            Connexion à PlantFinder
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
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
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
                value={credentials.password}
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
            Se connecter
          </button>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/register"
            className="text-sm text-gray-700 hover:underline"
          >
            Pas encore de compte? Inscrivez-vous
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
