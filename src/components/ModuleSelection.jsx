import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai"; // Import the icon
import CardComponent from "./CardComponent";
import Return from "./Return";
import ImageCard from "./ImageCard";
import { motion } from 'framer-motion'; // Import motion

export function ModuleSelection() {
  const navigate = useNavigate();

  const handleReturn = async () => {
    navigate("/");
  };

  const handleMaintenance = async () => {
    navigate("/maintenance");
  };

  const handleDocumentation = async () => {
    navigate("/documentation");
  };

  const handleLogout = async () => {
    navigate("/");
  };

  return (
    <motion.div 
      className="bg-neutral-900 w-full h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="flex justify-between items-center w-full p-4"
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        <h1 className="text-2xl text-white font-bold">FireVault</h1>
        <motion.div 
          className="bg-rose-600 p-4 rounded-lg shadow-md text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <p className="text-3xl text-white 2xl:text-4xl font-mono font-semibold">
            SECCIÓN DE MÓDULOS
          </p>
        </motion.div>
        <button
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
          onClick={handleReturn}
        >
          <AiOutlineLogout className="h-6 w-6" />
          <span>Volver</span>
        </button>
      </motion.div>
      <div className="w-full max-w-screen m-auto text-white">
        <div className="flex justify-center">
          <motion.span
            className="text-white-900 rounded my-6 p-2 2xl:my-12 text-2xl 2xl:text-3xl font-mono font-semibold"
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 120 }}
          >
            Selecciona un módulo:
          </motion.span>
        </div>
        <div className="flex items-center justify-center bg-auto">
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <ImageCard
              imageSrc="/assets/doc.jpg"
              title="Documentación"
              description="En este módulo encontrarás información sobre la documentación de los equipos automotrices."
              onClick={handleDocumentation}
            />
            <ImageCard
              imageSrc="/assets/mantenimiento.jpeg"
              title="Cronograma de mantenimiento"
              description="En este módulo podrás ver el cronograma de mantenimiento para los equipos automotrices."
              onClick={handleMaintenance}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ModuleSelection;
