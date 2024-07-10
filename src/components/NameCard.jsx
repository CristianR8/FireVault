import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NameCard = ({ key, title, codigo, onClick }) => {
  // Animation configurations
  const cardVariants = {
    hover: {
      scale: 1.1, // scale up on hover
      transition: {
        duration: 0.2,
        type: 'spring' // smooth spring-like motion
      }
    },
    initial: {
      opacity: 0,
      y: 20 // start slightly below the final position
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5 // animation duration
      }
    }
  };

  return (
    <motion.div 
      className="bg-rose-600 text-white font-bold hover:bg-white hover:text-gray-900 text-4xl py-4 rounded-lg mx-14 my-2"
      onClick={() => onClick({ codigo })}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Link 
        to={key} 
        title={title}
        className="flex flex-rows items-center justify-center space-y-2"
      >
        <div className="text-lg 2xl:text-2xl text-left">
          {title}
        </div>
      </Link>
    </motion.div>
  );
};

export default NameCard;
