import React from "react";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import Plant1 from "../assets/plant1.jpg";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Nav />
      <div className="relative w-full h-screen overflow-hidden">
        <img src={Plant1} alt="Plant1" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white p-6 space-y-4">
          <motion.h1
            className="text-3xl md:text-6xl font-extrabold text-center leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Explorez et contribuez à la science
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-center max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            Partagez vos découvertes avec notre communauté de passionnés de
            plantes et enrichissez notre base de données.
          </motion.p>
          <motion.a
            href="/gallery"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-lg font-semibold shadow-lg transition duration-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          >
            Découvrir la Galerie
          </motion.a>
        </div>
      </div>
      <Features />
      <Footer />
    </>
  );
}

export default Home;
