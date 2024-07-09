import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

export function HomeComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Error al cerrar sesión: ", error);
    }
  };

  const handleModule = async () => {
    navigate("/module");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", () => {
        video.currentTime = 0;
        video.play();
      });
    }
  }, []);

  const gradientKeyframes = {
    backgroundImage: [
      "linear-gradient(90deg, #ff5f6d 10%, #ffc371 90%)",  
      "linear-gradient(90deg, #ffc371 10%, #ff5f6d 90%)",  
      "linear-gradient(90deg, #ff7e5f 10%, #feb47b 90%)",  
      "linear-gradient(90deg, #feb47b 10%, #ff7e5f 90%)",  
      "linear-gradient(90deg, #ff6b6b 10%, #f7797d 90%)",  
      "linear-gradient(90deg, #f7797d 10%, #ff6b6b 90%)",  
      "linear-gradient(90deg, #ff5f6d 10%, #ffc371 90%)"   
    ],
  };
  
  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="assets/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content with Custom Background */}
      <div className="absolute inset-0 z-10 flex flex-col h-full px-4 text-white bg-black bg-opacity-50">
        {/* Header */}
        <div className="flex justify-between items-center w-full p-4">
          <h1 className="text-2xl font-bold">FireVault</h1>
          <div className="bg-rose-600 p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl md:text-3xl font-mono font-semibold">
              BIENVENIDO {user?.displayName || user?.email}
            </p>
          </div>
          <button
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
            onClick={handleLogout}
          >
            <AiOutlineLogout className="h-6 w-6" />
            <span>Salir</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-neutral-900 bg-opacity-40 p-8 rounded-lg shadow-lg text-center max-w-2xl text-white"
          >
            <motion.h1
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="text-5xl md:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundImage: gradientKeyframes.backgroundImage,
              }}
              transition={{
                duration: 1,
                delay: 0.8,
                backgroundImage: {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }}
            >
              FireVault
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-4 leading-relaxed"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              FireVault es la aplicación líder en gestión de inventarios
              diseñada para optimizar y simplificar tus operaciones
              empresariales. Con FireVault, tendrás un control total de tu
              inventario, asegurando precisión y eficiencia en cada paso.
            </motion.p>
            <div className="mb-4">
              <motion.p
                className="text-xl md:text-2xl font-mono font-semibold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                ¡FireVault es tu opción como gestor de inventarios!
              </motion.p>
            </div>
            <motion.button
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-6 rounded-lg"
              onClick={handleModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              Revisar Equipos
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
