import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai"; // Import the icon
import CardComponent from "./CardComponent";
import Return from "./Return";
import ImageCard from "./ImageCard";

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
    // Add your logout logic here, such as:
    // await auth.signOut();
    navigate("/");
  };

  return (
    <div className="bg-neutral-900 w-full h-screen">
      <div className="flex justify-between items-center w-full p-4">
        <h1 className="text-2xl text-white font-bold">FireVault</h1>
        <div className="bg-rose-600 p-4 rounded-lg shadow-md text-center">
          <p className="text-3xl text-white 2xl:text-4xl font-mono font-semibold">
            SECCIÓN DE MÓDULOS
          </p>
        </div>
        <button
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
          onClick={handleReturn}
        >
          <AiOutlineLogout className="h-6 w-6" />
          <span>Volver</span>
        </button>
      </div>
      <div className="w-full max-w-screen m-auto text-white">
        <div className="flex justify-center">
          <span className="text-white-900 rounded my-6 p-2 2xl:my-12 text-2xl 2xl:text-3xl font-mono font-semibold">
            Selecciona un módulo:
          </span>
        </div>
        <div className="flex items-center justify-center bg-auto">
          <div className="flex justify-center gap-4">
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
          </div>
        </div>
      </div>
      </div>
  );
}

export default ModuleSelection;
