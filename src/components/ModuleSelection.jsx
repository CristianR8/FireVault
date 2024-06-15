//import { useAuth } from '../context/authContext';
import React from "react";
import { useNavigate } from "react-router-dom";
import CardComponent from "./CardComponent";
import Return from './Return';
import ImageCard from "./ImageCard";

export function ModuleSelection() {
  const navigate = useNavigate();
  const handleReturn = async () => {
    navigate("/");
  };
  const handleMaintenance = async () => {
    navigate("/maintenance")
  }
  const handleDocumentation = async () => {
    navigate("/documentation")
  }

  return (
    <CardComponent>

      <div className="w-full max-w-screen m-auto text-white">
        <div className="bg-gray-800 mx-52 shadow-md rounded p-4 text-center ">
          <p className="text-3xl 2xl:text-4xl font-mono font-semibold "> SECCIÓN DE MÓDULOS  </p>

        </div>
        <div className="flex justify-center">
          <span className="text-gray-900 rounded my-6 p-2 2xl:my-12 text-2xl 2xl:text-3xl font-mono font-semibold">Selecciona un módulo: </span>
        </div>
        <div className="flex items-center justify-center bg-auto ">
          <div className="flex justify-center gap-4">
            <ImageCard
              imageSrc="/assets/doc.jpg"
              title="Documentación"
              description="En este módulo encontrarás informacón sobre la documentación de los equipos biomédicos "
              onClick={handleDocumentation}

            />
            <ImageCard
              imageSrc="/assets/mantenimiento.jpeg"
              title="Cronograma de mantenimiento"
              description="En este módulo podrás ver el cronograma de mantenimiento para los equipos biomédicos"
              onClick={handleMaintenance}
            />
          </div>
        </div>
      </div>
      <Return onClick={handleReturn} />
    </CardComponent>
  );
}
export default ModuleSelection;