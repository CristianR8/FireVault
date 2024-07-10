import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import Return from "./Return";
import CustomSelectField from "./CustomSelectField";
import { set, useForm } from "react-hook-form";
import { AiOutlineLogout } from "react-icons/ai"; // Import the icon


import Spinner from "./Spinner"
import SelectInput from "./SelectInput";
import { useNavigate } from "react-router-dom";
import { firestore, storage } from "../firebase";

import { DocGenerator } from "../services/DocGenerator";
import PizZip from "pizzip";
import ImageModule from "docxtemplater-image-module-free";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

import useAddProductStore from '../store/addproductStore'
import { modelHV } from "../models/modelHV";

import { useLocation } from "react-router-dom";

import Input from "./Input";
import { ref, deleteObject } from 'firebase/storage'

const EditHV = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const { hv, setHv } = useAddProductStore()

  const { state } = useLocation();

  let title = state?.title;
  let name = state?.name;
  let name2 = state?.name2;
  let folder = state?.folder;
  let code = state?.code;

  const [dataEdit, setDataEdit] = useState({});

  const retrieveDataEdit = async () => {
    if (name !== undefined) {
      let id = name.split(".")[0];
      console.log(id)
      //retrieve from firestore
      const docRef = doc(firestore, "hv", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDataEdit(docSnap.data());
        reset(docSnap.data())
      } else {
        console.log("No such document!");
      }

    }
  };

  useEffect(() => {
    retrieveDataEdit();
  }, []);


  const [camposAdicionales, setCamposAdicionales] = useState([]);
  const [camposAdicionalesAccesorios, setCamposAdicionalesAccesorios] =
    useState([]);

  const agregarCampo = () => {
    // Crea un nuevo campo con valores iniciales y agrégalo a la matriz de campos.
    const nuevoCampo = {
      nombreParte: "",
      marcaParte: "",
      modeloParte: "",
      referenciaParte: "",
      serialParte: "",
      c: 0,
    };
    setCamposAdicionales([...camposAdicionales, nuevoCampo]);
  };

  const agregarCampoAccesorio = () => {
    // Crea un nuevo campo con valores iniciales y agrégalo a la matriz de campos.
    const nuevoCampoAccesorio = {
      nombreAccesorio: "",
      marcaAccesorio: "",
      modeloAccesorio: "",
      referenciaAccesorio: "",
      serialAccesorio: "",
      ca: 0,
    };
    setCamposAdicionalesAccesorios([
      ...camposAdicionalesAccesorios,
      nuevoCampoAccesorio,
    ]);
  };


  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState({
    equipo: "", // Inicializa cada estado con un valor vacío
    estadoEquipo: "",
    planos: "",
    guiaManejo: "",
    frecuenciaMantenimiento: "",
    clasificacionRiesgo: "",
  });

  const handleSelectChange = (fieldName, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [fieldName]: value, // Actualiza el estado específico para el campo
    });
  };

  const [loading, setLoading] = useState(false);

  function getBase64(file, onLoadCallback) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const onSubmit = async (data) => {
    setLoading(true);

    let dataObj = modelHV(data, selectedOptions, camposAdicionales, camposAdicionalesAccesorios);


    //remove undefined fields
    Object.keys(dataObj).forEach(
      (key) => dataObj[key] === undefined && delete dataObj[key]
    );

    dataObj["firma"] = await getBase64(data.firma[0])
    dataObj["imagenesEquipo"] = await getBase64(data.imagenesEquipo[0])

    await setDoc(doc(firestore, "hv", String(dataObj.inventario)), dataObj);

    if (code !== undefined) {
      // delete the last file
      if (name !== undefined) {
        let storageRef = ref(storage, `database/hv/${name}`);
        await deleteObject(storageRef);
      }

      let images = { imagenesEquipo: dataObj.imagenesEquipo, firma: dataObj.firma }
      await DocGenerator("formularioEditHV", { ...dataObj, ...images }, String(dataObj.inventario) + ".docx", 'hv');
      await updateDoc(doc(firestore, "productos", String(code)), { hv: String(dataObj.inventario) + ".docx" });
      navigate("/documentation/hoja-de-vida", { state: { title: title, name: String(dataObj.inventario) + ".docx", folder: folder, code: String(code), name2: name2 } })
    } else {
      setHv(dataObj)
      navigate("/add-product");
    }

    console.log(dataObj);
    setLoading(false);
  };

  const handleReturn = async () => {
    navigate("/add-product");
  };

  return (
    loading ? <Spinner /> : (
      <CardComponent>
        <div className="flex justify-between items-center w-full p-4">
        <h1 className="text-2xl text-white font-bold">FireVault</h1>
        <div className="bg-rose-600 text-white shadow-md rounded-lg px-24 py-4 mx-52 text-center">
          <p className="sm:text-md lg:text-xl 2xl:text-3xl font-mono font-semibold ">
            Edicion - Hoja de Vida
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

        <div className="flex justify-center mt-4 text-center">
          <form
            className="bg-neutral-800 bg-opacity-100 rounded-lg shadow-lg p-8 mx-2 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                1. IDENTIFICACIÓN
              </p>

              <Input
                label="Versión"
                errors={errors}
                nameRegister="version"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.version}
              />

              <Input
                label="Fecha de elaboración"
                errors={errors}
                nameRegister="fechaElaboracion"
                colSpan="2"
                type="date"
                register={register}
                defaultValue={dataEdit.fechaElaboracion}
              />

              <Input
                label="Lote"
                errors={errors}
                nameRegister="lote"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.lote}
              />
              <Input
                label="No. de inventario"
                errors={errors}
                nameRegister="inventario"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.inventario}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                2. EQUIPO
              </p>
              <Input
                label="Nombre del equipo"
                errors={errors}
                nameRegister="nombreEquipo"
                colSpan="3"
                type="text"
                register={register}
                defaultValue={dataEdit.nombreEquipo}
              />
              <Input
                label="Marca"
                errors={errors}
                nameRegister="marca"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.marca}
              />
              <Input
                label="Fabricante"
                errors={errors}
                nameRegister="fabricante"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.fabricante}
              />
              <Input
                label="Modelo"
                errors={errors}
                nameRegister="modelo"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.modelo}
              />

              <Input
                label="Linea de producto"
                errors={errors}
                nameRegister="lineaProducto"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.lineaProducto}
              />
              <Input
                label="Ubicación"
                errors={errors}
                nameRegister="ubicacion"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.ubicacion}
              />
              <Input
                label="Responsable del equipo"
                errors={errors}
                nameRegister="responsableEquipo"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.responsableEquipo}
              />

              <div className={`col-span-1`}>
                <label className="block text-xl font-mono text-white font-semibold">
                  Equipo
                </label>
                <select
                  label="Equipo"
                  placeholder="Seleccione un tipo"
                  nameRegister="equipo"
                  className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  onChange={(e) => handleSelectChange("equipo", e.target.value)}
                  value={selectedOptions.equipo}
                  defaultValue={dataEdit.equipo}
                >
                  <option value=""></option>
                  <option value="Movil">Movil</option>
                  <option value="Fijo">Fijo</option>
                </select>
              </div>

              <div className={`col-span-1`}>
                <label className="block text-xl font-mono text-white font-semibold">
                  Estado del equipo
                </label>
                <select
                  label="Estado del equipo"
                  placeholder="Seleccione un tipo"
                  nameRegister="estadoEquipo"
                  className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  onChange={(e) =>
                    handleSelectChange("estadoEquipo", e.target.value)
                  }
                  value={selectedOptions.estadoEquipo}
                  defaultValue={dataEdit.estadoEquipo}
                >
                  <option value=""></option>
                  <option value="normal">Normal</option>
                  <option value="irregular">Irregular</option>
                  <option value="fueraDeServicio">Fuera de Servicio</option>
                </select>
              </div>

              <Input
                label="Registro sanitario "
                errors={errors}
                nameRegister="registroSanitario"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.registroSanitario}
              />

              <div className="col-span-3">
                <label className="block text-2xl font-mono text-white font-semibold">
                  Imágenes del equipo
                </label>
                <input
                  className="bg-white border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                  type="file"
                  nameRegister="imagenesEquipo"
                  accept="image/*"
                  {...register("imagenesEquipo")}
                />
              </div>

              <Input
                label="Uso del equipo"
                errors={errors}
                nameRegister="usoEquipo"
                colSpan="3"
                type="text"
                register={register}
                defaultValue={dataEdit.usoEquipo}
              />



              <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                3. REGISTRO TÉCNICO DE INSTALACIÓN
              </p>
              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-12 p-2 text-center">
                AMBIENTALES
              </p>

              <Input
                label="Temperatura"
                errors={errors}
                nameRegister="temperatura"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.temperatura}
              />
              <Input
                label="Humedad"
                errors={errors}
                nameRegister="humedad"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.humedad}
              />
              <Input
                label="Altitud"
                errors={errors}
                nameRegister="altitud"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.altitud}
              />
              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-12 p-2 text-center">
                Fisicos
              </p>

              <Input
                label="Alto"
                errors={errors}
                nameRegister="alto"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.alto}
              />
              <Input
                label="Ancho"
                errors={errors}
                nameRegister="ancho"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.ancho}
              />
              <Input
                label="Profundidad"
                errors={errors}
                nameRegister="profundidad"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.profundidad}
              />
              <Input
                label="Peso"
                errors={errors}
                nameRegister="peso"
                colSpan="3"
                className="col-span-2"
                type="text"
                register={register}
                defaultValue={dataEdit.peso}
              />

              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-12 p-2 text-center">
                Alimentación
              </p>

              <Input
                label="Voltaje"
                errors={errors}
                nameRegister="voltaje"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.voltaje}
              />
              <Input
                label="Potencia "
                errors={errors}
                nameRegister="potencia"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.potencia}
              />
              <Input
                label="Corriente"
                errors={errors}
                nameRegister="corriente"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.corriente}
              />
              <Input
                label="Frecuencia"
                errors={errors}
                nameRegister="frecuencia"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.frecuencia}
              />
              <Input
                label="Fuente"
                errors={errors}
                nameRegister="fuente"
                colSpan="2"
                className="col-span-2"
                type="text"
                register={register}
                defaultValue={dataEdit.fuente}
              />
              <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                4. REGISTRO TÉCNICO DE MANTENIMIENTO
              </p>
              <Input
                label="Rango de voltaje"
                errors={errors}
                nameRegister="rangoVoltaje"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoVoltaje}
              />
              <Input
                label="Rango de potencia"
                errors={errors}
                nameRegister="rangoPotencia"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoPotencia}
              />
              <Input
                label="Rango de presión"
                errors={errors}
                nameRegister="rangoPresion"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoPresion}
              />
              <Input
                label="Rango de humedad"
                errors={errors}
                nameRegister="rangoHumedad"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoHumedad}
              />
              <Input
                label="Rango de corriente"
                errors={errors}
                nameRegister="rangoCorriente"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoCorriente}
              />
              <Input
                label="Frecuencia"
                errors={errors}
                nameRegister="frecuenciaTecMant"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.frecuenciaTecMant}
              />
              <Input
                label="Rango de velocidad"
                errors={errors}
                nameRegister="rangoVelocidad"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoVelocidad}
              />
              <Input
                label="Peso"
                errors={errors}
                nameRegister="pesoTecMant"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.pesoTecMant}
              />
              <Input
                label="Rango de temperatura"
                errors={errors}
                nameRegister="rangoTemperaturaTecMant"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.rangoTemperaturaTecMant}
              />
              <Input
                label="Accionamiento"
                errors={errors}
                nameRegister="accionamiento"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.accionamiento}
              />
              <Input
                label="Otras recomendaciones del fabricante"
                errors={errors}
                nameRegister="recomendacionesFabricante"
                colSpan="2"
                type="text"
                register={register}
                defaultValue={dataEdit.recomendacionesFabricante}
              />
              <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                5. REGISTRO DE APOYO TÉCNICO
              </p>
              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-96 p-2 text-center">
                MANUALES
              </p>



              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Operación"
                errors={errors}
                colSpan="1"
                nameRegister="operacion"
                register={register}
                defaultValue={dataEdit.operacion}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Mantenimiento"
                errors={errors}
                colSpan="1"
                nameRegister="mantenimiento"
                register={register}
                defaultValue={dataEdit.mantenimiento}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Instalación"
                errors={errors}
                colSpan="1"
                nameRegister="instalacion"
                register={register}
                defaultValue={dataEdit.instalacion}
              />
              <Input
                label="Otros"
                errors={errors}
                className="rounded-lg"
                nameRegister="otrosRegTec"
                colSpan="3"
                type="text"
                register={register}
                defaultValue={dataEdit.otrosRegTec}
              />

              <div className={`col-span-1`}>
                <label className="block text-xl font-mono text-white font-semibold">
                  Planos
                </label>
                <select
                  label="Planos"
                  placeholder="Seleccione un tipo"
                  nameRegister="estadoEquipo"
                  className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  onChange={(e) => handleSelectChange("planos", e.target.value)}
                  value={selectedOptions.planos}
                  defaultValue={dataEdit.planos}
                >
                  <option value=""></option>
                  <option value="Electricos">Electricos</option>
                  <option value="Neumaticos">Neumaticos</option>
                  <option value="Mecanicos">Mecanicos</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <Input
                label="Fecha de adquisición"
                errors={errors}
                nameRegister="fechaAdquision"
                colSpan="1"
                type="date"
                register={register}
                defaultValue={dataEdit.fechaAdquision}
              />
              <Input
                label="Tiempo de garantía"
                errors={errors}
                nameRegister="tiempoGarantia"
                colSpan="1"
                type="text"
                register={register}
                defaultValue={dataEdit.tiempoGarantia}
              />

              <div className={`col-span-1`}>
                <label className="block text-l font-mono text-white font-semibold">
                  ¿Cuenta con guia de manejo rapido?
                </label>
                <select
                  label="¿Cuenta con guia de manejo rapido? "
                  placeholder="Seleccione un tipo"
                  nameRegister="guiaManejo"
                  className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  onChange={(e) =>
                    handleSelectChange("guiaManejo", e.target.value)
                  }
                  value={selectedOptions.guiaManejo}
                  defaultValue={dataEdit.guiaManejo}
                >
                  <option value=""></option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div className={`col-span-1`}>
                <label className="block text-l font-mono text-white font-semibold">
                  Frecuencia de mantenimiento
                </label>
                <select
                  label="Frecuencia de mantenimiento "
                  placeholder="Seleccione un tipo"
                  nameRegister="frecuenciaMantenimiento"
                  className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  onChange={(e) =>
                    handleSelectChange("frecuenciaMantenimiento", e.target.value)
                  }
                  value={selectedOptions.frecuenciaMantenimiento}
                  defaultValue={dataEdit.frecuenciaMantenimiento}
                >
                  <option value=""></option>
                  <option value="Semestral">Semestral</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>

              <div className={`col-span-1`}>
                <label className="block text-l font-mono text-white font-semibold">
                  Clasificación por riesgo
                </label>
                <select
                  label="Clasificación por riesgo "
                  placeholder="Seleccione un tipo"
                  nameRegister="clasificacionRiesgo"
                  className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  onChange={(e) =>
                    handleSelectChange("clasificacionRiesgo", e.target.value)
                  }
                  value={selectedOptions.clasificacionRiesgo}
                  defaultValue={dataEdit.clasificacionRiesgo}
                >
                  <option value=""></option>
                  <option value="Clase I">Clase I</option>
                  <option value="Clase IIA">Clase IIA</option>
                  <option value="Clase IIB">Clase IIB</option>
                  <option value="Clase III">Clase III</option>
                </select>
              </div>
              <Input
                label="Otras recomendaciones técnicas"
                errors={errors}
                nameRegister="otrasRecTec"
                colSpan="3"
                type="text"
                register={register}
                defaultValue={dataEdit.otrasRecTec}
              />
              <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                6. DIAGNÓSTICO
              </p>
              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-12 p-2 text-center">
                Preventivo
              </p>
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Si"
                errors={errors}
                colSpan="1"
                nameRegister="preventivoSi"
                value="Si"
                register={register}
                defaultValue={dataEdit.preventivoSi}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Propio"
                errors={errors}
                colSpan="1"
                nameRegister="preventivoPropio"
                register={register}
                defaultValue={dataEdit.preventivoPropio}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="No"
                errors={errors}
                colSpan="1"
                nameRegister="preventivoNo"
                register={register}
                defaultValue={dataEdit.preventivoNo}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Tercerizado"
                errors={errors}
                colSpan="1"
                nameRegister="preventivoTercerizado"
                register={register}
                defaultValue={dataEdit.preventivoTercerizado}
              />
              <Input
                label="Nota"
                errors={errors}
                className="rounded-lg"
                nameRegister="preventivoNota"
                colSpan="2"
                type="text"
                register={register}
                defaultValue={dataEdit.preventivoNota}
              />
              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-12 p-2 text-center">
                Correctivo
              </p>
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Si"
                errors={errors}
                colSpan="1"
                nameRegister="correctivoSi"
                register={register}
                defaultValue={dataEdit.correctivoSi}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Propio"
                errors={errors}
                colSpan="1"
                nameRegister="correctivoPropio"
                register={register}
                defaultValue={dataEdit.correctivoPropio}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="No"
                errors={errors}
                colSpan="1"
                nameRegister="correctivoNo"
                register={register}
                defaultValue={dataEdit.correctivoNo}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Tercerizado"
                errors={errors}
                colSpan="1"
                nameRegister="correctivoTercerizado"
                register={register}
                defaultValue={dataEdit.correctivoTercerizado}
              />
              <Input
                label="Nota"
                errors={errors}
                className="rounded-lg"
                nameRegister="correctivoNota"
                colSpan="2"
                type="text"
                register={register}
                defaultValue={dataEdit.correctivoNota}
              />
              <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white my-6 mx-12 p-2 text-center">
                Calibración
              </p>
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Si"
                errors={errors}
                colSpan="1"
                nameRegister="calibracionSi"
                register={register}
                defaultValue={dataEdit.calibracionSi}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Propio"
                errors={errors}
                colSpan="1"
                nameRegister="calibracionPropio"
                register={register}
                defaultValue={dataEdit.calibracionPropio}
              />
              <Input
                class="w-48 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="No"
                errors={errors}
                colSpan="1"
                nameRegister="calibracionNo"
                register={register}
                defaultValue={dataEdit.calibracionNo}
              />
              <Input
                class="w-24 h-8 rounded-lg font-medium text-blue-500 dark:text-gray-300"
                type="checkbox"
                label="Tercerizado"
                errors={errors}
                colSpan="1"
                nameRegister="calibracionTercerizado"
                register={register}
                defaultValue={dataEdit.calibracionTercerizado}
              />
              <Input
                label="Nota"
                errors={errors}
                className="rounded-lg"
                nameRegister="calibracionNota"
                colSpan="2"
                type="text"
                register={register}
                defaultValue={dataEdit.calibracionNota}
              />
            </div>

            <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
              7. COMPONENTES
            </p>

            <p className="block col-span-3 text-xl rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
              Para agregar en la sección de componentes las partes de los equipos
              requeridos agregue los campos necesarios presionando el botón de
              agregar campos de partes.
            </p>

            {camposAdicionales.map((campo, index) => (
              <div key={index} className="flex-auto">
                <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mx-72 p-2 text-center mt-4 mb-4">
                  Partes {`${index}`}

                </p>
                <Input
                  label="Nombre"
                  errors={errors}
                  nameRegister={`nombreParte${index}`} // Añade el índice al nombre del campo
                  type="text"
                  register={register}
                />

                <Input
                  label="Marca"
                  errors={errors}
                  nameRegister={`marcaParte${index}`}
                  type="text"
                  register={register}
                />

                <Input
                  label="Modelo"
                  errors={errors}
                  nameRegister={`modeloParte${index}`}
                  type="text"
                  register={register}
                />

                <Input
                  label="No. de referencia"
                  errors={errors}
                  nameRegister={`referenciaParte${index}`}
                  type="text"
                  register={register}
                />

                <Input
                  label="Lote / Serial"
                  errors={errors}
                  nameRegister={`serialParte${index}`}
                  type="text"
                  register={register}
                />

                <Input
                  label="Cantidad"
                  errors={errors}
                  nameRegister={`c${index}`}
                  type="number"
                  register={register}
                />

                {/* Renderiza otros campos similares aquí */}
              </div>
            ))}

            {/* Botón para agregar más campos */}
            <div className="w-full mb-4">
              <button
                type="button"
                onClick={agregarCampo}
                className="w-full my-5 py-2 bg-gray-400 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg"
              >
                Agregar campos de partes
              </button>
            </div>

            <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mx-72 p-2 text-center">
              Accesorios
            </p>

            <p className="block col-span-3 text-xl rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
              Para agregar en la sección de componentes los accesorios de los
              equipos requeridos agregue los campos necesarios presionando el
              botón de agregar campos de accesorios.
            </p>

            {camposAdicionalesAccesorios.map((campo, index) => (
              <div key={index} className="flex-auto">
                <p className="block col-span-3 text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mx-72 p-2 text-center mt-4 mb-4">
                  Accesorio {`${index}`}
                </p>

                <Input
                  label="Nombre"
                  errors={errors}
                  nameRegister={`nombreAccesorio${index}`} // Añade el índice al nombre del campo
                  colSpan="1"
                  type="text"
                  register={register}
                />
                <Input
                  label="Marca"
                  errors={errors}
                  nameRegister={`marcaAccesorio${index}`}
                  colSpan="1"
                  type="text"
                  register={register}
                />
                <Input
                  label="Modelo"
                  errors={errors}
                  nameRegister={`modeloAccesorio${index}`}
                  colSpan="1"
                  type="text"
                  register={register}
                />
                <Input
                  label="No. de referencia"
                  errors={errors}
                  nameRegister={`referenciaAccesorio${index}`}
                  colSpan="1"
                  type="text"
                  register={register}
                />
                <Input
                  label="Lote / Serial"
                  errors={errors}
                  nameRegister={`serialAccesorio${index}`}
                  colSpan="1"
                  type="text"
                  register={register}
                />

                <Input
                  label="Cantidad"
                  errors={errors}
                  nameRegister={`ca${index}`}
                  colSpan="1"
                  type="number"
                  register={register}
                />

                <Input
                  label="Observaciones"
                  errors={errors}
                  nameRegister="observacionesFinal"
                  colSpan="2"
                  type="text"
                  register={register}
                />

              </div>
            ))}

            {/* Botón para agregar más campos */}
            <div className="w-full mb-4">
              <button
                type="button"
                onClick={agregarCampoAccesorio}
                className="w-full my-5 py-2 bg-gray-400 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg"
              >
                Agregar campos de accesorios
              </button>
            </div>

            <p className="block col-span-3 text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
              8. OBSERVACIONES ADICIONALES
            </p>
            <Input
              label="Fecha"
              errors={errors}
              nameRegister="fechaFinal"
              colSpan="1"
              type="date"
              register={register}
              defaultValue={dataEdit.fechaFinal}
            />
            <Input
              label="Observaciones"
              errors={errors}
              nameRegister="observacionesFinal"
              colSpan="2"
              type="text"
              register={register}
              defaultValue={dataEdit.observacionesFinal}
            />

            <div className="col-span-3">
              <label className="block text-xl font-mono text-white font-semibold">
                Firma
              </label>
              <input
                className="bg-white border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                type="file"
                nameRegister="firma"
                accept="image/*"
                {...register("firma")}
              />
            </div>

            <div className="mt-5" />

            <div className="flex relative w-full text-gray-400 py-2">
              <button className="w-full my-5 py-2 text-2xl bg-gray-400 hover:shadow-gray-500/50 duration-150 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg">
                Agregar
              </button>
            </div>
          </form>
        </div>
      </CardComponent>
    )
  );

};

export default EditHV;