import React, { useState } from "react";
import CardComponent from "./CardComponent";
import Return from "./Return";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Input from "./Input";
import InputFile from "./InputFIle";
import InputFileTwo from "./InputFileTwo";
import { Link } from 'react-router-dom';
import Spinner from "./Spinner"

import { useNavigate } from "react-router-dom";

import { firestore, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import useAddProductStore from '../store/addproductStore'
import { DocGenerator } from "../services/DocGenerator";

const uploadPdf = async (pdf, folder) => {
  const storageRef = ref(storage, `/database/${folder}/${pdf.name}`);
  await uploadBytes(storageRef, pdf).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
};

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm();

  const { hv,rps,data, setData, setHv, setRps } = useAddProductStore()



  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    const nuevoObjeto = {};
    const names = {};

    for (const key in data) {
      if (data[key] instanceof FileList && data[key].length > 0) {
        nuevoObjeto[key] = data[key][0];
      }
    }

    Object.keys(nuevoObjeto).forEach((key) => {
      names[key] = nuevoObjeto[key].name;
    });


    if (Object.keys(hv).length) {
      names.hv = String(hv.inventario) + ".docx";
    }
    if (Object.keys(rps).length) {
      names.rps = rps.numeroInventario + ".docx";
    }

    console.log(names)

    setDoc(doc(firestore, "productos", data.codigo), {
      nombre: data.nombre,
      lote: data.lote,
      ciudad: data.ciudad,
      codigo: data.codigo,
      ...names,
    });

    const files = Object.keys(nuevoObjeto).map((key) => ({
      folder: key,
      file: nuevoObjeto[key],
    }));

    let promises = files.map((file) => uploadPdf(file.file, file.folder));

    const filesRes = await Promise.all(promises);

    if (Object.keys(hv).length) {
      let images = {imagenesEquipo: hv.imagenesEquipo, firma: hv.firma}
      DocGenerator("formularioEditHV", {...hv, ...images}, names.hv  , 'hv');
    }

    if (Object.keys(rps).length) {
      let images = {FirmaEntrego: rps.FirmaEntrego, FirmaRecibio: rps.FirmaRecibio, FirmaResponsable:rps.FirmaResponsable}
      DocGenerator("formularioEditRS", {...rps, ...images}, names.rps, 'rps');
    }

    setLoading(false);
    setData({})
    setHv({})
    setRps({})
    navigate("/documentation");

  };

  const handleReturn = async () => {
    setData({})
    setHv({})
    setRps({})
    navigate("/documentation");
  };

  const handlehv = () => {
    setData(getValues())
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
    loading ? <Spinner/> : (
    <CardComponent>
      <div>
        <div className="bg-gray-400 shadow-md rounded-lg px-8 p-4 mx-52 text-center">
          <p className="text-3xl font-mono font-semibold ">
            {" "}
            Agregar productos{" "}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-1 gap-4 bg-gray-950 bg-opacity-100 2xl:flex-row items-center justify-center rounded-lg shadow-lg py-2 px-8 mx-2 w-3/4 2xl:w-1/2 text-cente "
        >
          <div className="flex flex-row text-gray-400 w-full">
            <div className="flex flex-col mr-3 flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-4 mr-10 ">
                Nombre
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="nombre"
                type="text"
                placeholder="Nombre"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                defaultValue={data.nombre} 
                //{...register("nombre", { required: true })}
              />
              {errors.nombre && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <label className="block text-xl font-mono text-white font-semibold mt-4 mr-10">
                Codigo
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="codigo"
                type="text"
                placeholder="Codigo"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                defaultValue={data.codigo}
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

              <label className="block text-gray-800 text-xl font-mono text-white font-semibold mt-2 mr-10">
                Lote
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="lote"
                type="text"
                placeholder="Lote"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                defaultValue={data.lote}
                //{...register("nombre", { required: true })}
              />
              {errors.lote && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>

            <div className="flex flex-col flex-grow">

              <label className="block text-xl font-mono text-white font-semibold mt-2 mr-10">

                Ciudad
              </label>
              <Input
                errors={errors}
                register={register}
                nameRegister="ciudad"
                type="text"
                placeholder="Ciudad"
                className="border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                defaultValue={data.ciudad}
                //{...register("nombre", { required: true })}
              />
              {errors.ciudad && (
                <span className="text-red-500 text-sm">
                  Este campo es obligatorio
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row text-gray-400 w-full">

            <InputFileTwo
              nameLabel="Hoja de vida"
              nameRegister="hv"
              register={register}
              routeTo="/edit-hv"
              onClick={handlehv}
              Submitted={`${Object.keys(hv).length ? 'green' : 'gray'}`}
            />
            
 
            <InputFileTwo
              nameLabel="Reporte de servicio"
              nameRegister="rps"
              register={register}
              routeTo="/edit-rs"
              Submitted={`${Object.keys(rps).length ? 'green' : 'gray'}`}

            />
          </div>

          <div className="flex flex-row text-gray-400 w-full">
            <InputFile
              nameLabel="Guia de manejo"
              nameRegister="gmr"
              register={register}
            />

            <InputFile
              nameLabel="Ficha tecnica"
              nameRegister="ft"
              register={register}
            />
          </div>

          <div className="flex flex-row text-gray-400 w-full">
            <InputFile
              nameLabel="Protocolo de limpieza"
              nameRegister="ptl"
              register={register}
            />

            <InputFile
              nameLabel="Manual usuario"
              nameRegister="mu"
              register={register}
            />
          </div>

          <div className="flex flex-row text-gray-400 w-full">
            <InputFile
              nameLabel="Hoja de vida personal"
              nameRegister="hvp"
              register={register}
            />
          </div>

          <div className="flex w-full text-gray-400 py-2">
            <button 
            className="w-full text-xl my-5 py-2 bg-gray-400 hover:shadow-lg hover:shadow-gray-500/40 duration-150 text-gray-800 font-bold rounded-lg"

            >
              
              Agregar
            </button>
          </div>

          
        </form>
      </div>

      <Return onClick={handleReturn} />
    </CardComponent>
    )
  );
};

export default AddProduct;
