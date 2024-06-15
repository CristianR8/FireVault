import React from "react";
import CardComponent from "./CardComponent";
import Return from "./Return";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Input from "./Input";

import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const handleReturn = async () => {
    navigate("/documentation");
  };

  const documents = [
    { value: "1", label: "Hoja de vida" },
    { value: "2", label: "Guía de manejo rapido" },
    { value: "3", label: "Ficha tecnica" },
    { value: "4", label: "Manual de usuario" },
    { value: "5", label: "Hoja de vida personal" },
    { value: "6", label: "Protocolo de limpieza" },
  ];

  return (
    <CardComponent>
      <div>
        <div className="bg-gray-400 shadow-md rounded-lg px-8 p-4 mx-52 text-center">
          <p className="text-3xl font-mono font-semibold ">
            {" "}
            Editar producto{" "}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-purple-300 bg-opacity-100 flex flex-col 3xl:flex-row items-center justify-center rounded-lg shadow-lg p-8 mx-2 w-full lg:w-1/2 text-center "
        >
          <div className="flex flex-row text-gray-400 mt-2 w-full">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-gray-800 text-2xl font-mono font-semibold mt-4 mx-10 ">
                Nombre
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="nombre"
                type="text"
                placeholder="Nombre"
                className="border border-gray-400 rounded-lg px-4 w-full" 
                value="nombre"//sabes como hacer el input mas ancho? osea que ocupe todo el espacio disponible en el div seria algo asi: className="border border-gray-400 rounded-lg px-4 w-full"
                //{...register("nombre", { required: true })}
              />
              {errors.nombre && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="block text-gray-800 text-2xl font-mono font-semibold mt-4 mx-10">
                Codigo
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="codigo"
                type="text"
                placeholder="Codigo"
                className="border border-gray-400 rounded-lg px-4 w-full"
                value="codigo"
                //{...register("nombre", { required: true })}
              />
              {errors.codigo && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row text-gray-400 w-full">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-gray-800 text-2xl font-mono font-semibold mt-2 mx-10">
                Lote
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="lote"
                type="text"
                placeholder="Lote"
                className="border border-gray-400 rounded-lg px-4 w-full"
                value="lote"
                //{...register("nombre", { required: true })}
              />
              {errors.lote && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="block text-gray-800 text-2xl font-mono font-semibold mt-2 mx-10">
                Ciudad
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="ciudad"
                type="text"
                placeholder="Ciudad"
                className="border border-gray-400 rounded-lg px-4 w-full"
                value="ciudad"
                //{...register("nombre", { required: true })}
              />
              {errors.ciudad && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex w-full text-gray-400 py-2">
            
            <Select
              options={documents}
              placeholder="Tipo de documento"
              className="w-full block text-gray-800 text-md font-medium mt-4"
            />
          </div>
          <div className="flex w-full text-gray-400 py-2">
            <button className="w-full my-5 py-2 bg-gray-400 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg">
              Agregar
            </button>
          </div>
        </form>
      </div>

      <Return onClick={handleReturn} />
    </CardComponent>
  );
};

export default AddProduct;
