import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DocsCard = ({ title, url, url2, folder, icon, to, code }) => {
  // Animation configurations
  const cardVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        type: 'spring'
      }
    },
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    initial: {
      x: -50,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="bg-rose-600 text-white text-center font-bold hover:bg-white hover:text-neutral-900 text-4xl py-4 rounded-lg mx-14 my-2 group"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Link 
        to={to} 
        state={{ title: title, name: url, folder: folder, code: code, name2: url2 }} 
        className="flex flex-rows items-center justify-center space-y-2"
      >
        <motion.div 
          className="text-lg 2xl:text-2xl text-inherit"
          variants={cardVariants}
        >
          {title}
        </motion.div>
        <motion.div 
          className="text-4xl 2xl:text-5xl text-inherit ml-4"
          variants={iconVariants}
        >
          {icon}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default DocsCard;
