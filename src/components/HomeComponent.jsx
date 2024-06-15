import React from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import CardComponent from "./CardComponent";
import ImageCard from "./ImageCard";

export function HomeComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert("Error al cerrar sesión: ", error);
    }
  };

  const handleModule = async () => {
    navigate("/module");
  };

  return (
    <CardComponent>
      <div className="w-full max-w-screen m-auto text-white">
        <div className="bg-gray-800 mx-52 shadow-md rounded p-2 text-center">
          <p className="text-2xl 2xl:text-3xl  font-mono font-semibold">
            BIENVENIDO {user?.displayName || user?.email}
          </p>
          <p className="text-xl 2xl:text-2xl mb-4">Rol: {user.role}</p>

        </div>
        <div className="flex justify-center">
          <span className="text-gray-900 rounded my-6 2xl:my-12 p-2 text-2xl 2xl:text-3xl  font-mono font-semibold">Selecciona una sección: </span>
        </div>
        <div className="flex justify-center gap-4">
          <ImageCard
            imageSrc="/assets/equipo_biomedico.jpeg"
            title="Equipos Biomédicos"
            description="En esta sección encontraras información de los equipos biomédicos"
            onClick={handleModule}
          />
          <ImageCard
            className=""
            imageSrc="/assets/instrumental.jpeg"
            title="Instrumental"
            description="En esta sección encontraras información relevante acerca de los instrumentos biomédicos"
            onClick={() => { }}
          />
          <button
            className="bg-slate-200 hover:bg-slate-300 rounded m-5 py-2 px-4 text-black text-base md:text-lg flex items-center justify-center space-x-2 mx-auto absolute bottom-0 right-0 p-5"
            onClick={handleLogout}
          >
            <div> {/* Agregamos un elemento contenedor */}
              <svg
                className="h-8 w-8 2xl:h-12 2xl:w-12 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              <span className="2xl:text-2xl">Salir</span>
            </div>

          </button>

        </div>
      </div>
    </CardComponent>

  );
}

export default HomeComponent;
