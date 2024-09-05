import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUser, FaCamera, FaSearch } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const Features = () => {
  // Définir les variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Délai entre chaque enfant
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Utiliser l'observer pour détecter l'entrée dans la vue
  const [ref, inView] = useInView({
    triggerOnce: true, // Lancer une seule fois
    threshold: 0.1, // Se déclenche quand 10% du composant est visible
  });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center bg-gradient-to-b from-green-900 via-green-800 to-green-700 py-20"
    >
      <div className="w-full md:w-3/4 flex flex-col items-center justify-center px-4">
        <motion.h2
          className="text-4xl font-extrabold text-center mb-16 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Fonctionnalités
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {[
            {
              Icon: FaLeaf,
              title: 'En apprendre davantage sur les plantes',
              description:
                'Explorez une vaste collection d\'images et de descriptions détaillées pour découvrir des plantes de toutes sortes.',
            },
            {
              Icon: FaUser,
              title: 'Personnaliser votre expérience',
              description:
                'Gérez votre profil en ajoutant une photo et en mettant à jour vos informations personnelles pour mieux vous connecter avec la communauté.',
            },
            {
              Icon: FaCamera,
              title: 'Contribuez à la communauté scientifique',
              description:
                'Téléchargez vos propres images de plantes, ajoutez des descriptions et des mots-clés pour aider à enrichir notre base de données commune.',
            },
            {
              Icon: FaSearch,
              title: 'Trouver exactement ce que vous cherchez',
              description:
                'Utilisez nos outils de recherche avancée et de filtrage pour trouver rapidement les images de plantes qui vous intéressent.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-xl shadow-xl hover:shadow-2xl transform transition-transform duration-500"
              variants={cardVariants}
            >
              <feature.Icon className="text-5xl mb-6 text-green-300" />
              <h3 className="text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-white">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
