import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import Return from "./Return";
import Select from "react-select";
import CustomSelectField from "./CustomSelectField";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { firestore, storage } from "../firebase";
import Spinner from "./Spinner";
import { AiOutlineLogout } from "react-icons/ai"; // Import the icon


import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { DocGenerator } from "../services/DocGenerator";
import useAddProductStore from "../store/addproductStore";

import { useLocation } from "react-router-dom";
import { modelRS } from "../models/modelRS";
import { ref, deleteObject } from "firebase/storage";

import Input from "./Input";
const EditRS = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { rps, setRps } = useAddProductStore();

  const { state } = useLocation();

  let title = state?.title;
  let name = state?.name;
  let name2 = state?.name2;
  let folder = state?.folder;
  let code = state?.code;

  const [dataEdit, setDataEdit] = useState({});

  const retrieveDataEdit = async () => {
    if (name2 !== undefined) {
      let id = name2.split(".")[0];
      console.log(id);
      //retrieve from firestore
      const docRef = doc(firestore, "rps", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDataEdit(docSnap.data());
        reset(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    retrieveDataEdit();
  }, []);

  const [camposAdicionales, setCamposAdicionales] = useState([]);
  const [camposAdicionalesR, setCamposAdicionalesR] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const boolean = [{ label: "SI" }, { label: "NO" }];

  const handleImageUpload = (e) => {
    const files = e.target.files; // Obtén los archivos seleccionados

    // Convierte los archivos en rutas de imágenes (URLs)
    const imageUrls = Array.from(files).map((file) => {
      // Genera una URL para el archivo usando el objeto URL
      const imageUrl = URL.createObjectURL(file);
      return imageUrl;
    });

    // Actualiza el objeto de datos con las rutas de las imágenes
    setDataObj({ ...dataObj, imagenesEquipo: imageUrls });
  };

  function getBase64(file, onLoadCallback) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const agregarCampo = () => {
    const nuevoCampo = {
      pruebaFalla: "",
      descripcionMantenimiento: "",
      observacionesMantenimiento: "",
    };
    setCamposAdicionales([...camposAdicionales, nuevoCampo]);
  };

  const agregarCampoR = () => {
    const nuevoCampoR = {
      cantidadRepuestos: "",
      descripcionRepuestos: "",
      referenciaRepuestos: "",
    };
    setCamposAdicionalesR([...camposAdicionalesR, nuevoCampoR]);
  };

  const handleSelectChange = (fieldName, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [fieldName]: value, // Actualiza el estado específico para el campo
    });
  };

  const [selectedOptions, setSelectedOptions] = useState({
    carcaza: "",
    accesorios: "",
    conectores: "",
    interruptores: "",
    indicadores: "",
    cargadores: "",
    sistemaElectrico: "",
    sistemaElectronico: "",
    medicion: "",
    empaques: "",
    nivelesAlarma: "",
    otros: "",
    pR: "",
    eFQ: "",
    mS: "",
    descontaminacion: "",
  });

  const onSubmit = async (data) => {
    setLoading(true);

    let dataObj = modelRS(
      data,
      selectedOptions,
      camposAdicionales,
      camposAdicionalesR
    );

    //remove undefined fields
    Object.keys(dataObj).forEach(
      (key) => dataObj[key] === undefined && delete dataObj[key]
    );

    dataObj["FirmaEntrego"] = await getBase64(data.FirmaEntrego[0]);
    dataObj["FirmaRecibio"] = await getBase64(data.FirmaRecibio[0]);
    dataObj["FirmaResponsable"] = await getBase64(data.FirmaResponsable[0]);

    console.log("inv");

    await setDoc(
      doc(firestore, "rps", String(dataObj.numeroInventario)),
      dataObj
    );

    if (code !== undefined) {
      if (name2 !== undefined) {
        let storageRef = ref(storage, `database/rps/${name2}`);
        await deleteObject(storageRef);
      }

      let images = {
        FirmaEntrego: dataObj.FirmaEntrego,
        FirmaRecibio: dataObj.FirmaRecibio,
        FirmaResponsable: dataObj.FirmaResponsable,
      };
      await DocGenerator(
        "formularioEditRS",
        { ...dataObj, ...images },
        String(dataObj.numeroInventario) + ".docx",
        "rps"
      );
      await updateDoc(doc(firestore, "productos", String(code)), {
        rps: String(dataObj.numeroInventario) + ".docx",
      });
      navigate("/documentation/reporte-de-servicio", {
        state: {
          title: title,
          name: String(dataObj.inventario) + ".docx",
          folder: folder,
          code: String(code),
          name2: name2,
        },
      });
    } else {
      setRps(dataObj);
      navigate("/add-product");
    }

    console.log(dataObj);
    setLoading(false);
  };

  const handleReturn = async () => {
    navigate("/add-product");
  };

  return loading ? (
    <Spinner />
  ) : (
    <CardComponent>
      <div className="flex justify-between items-center w-full p-4">
        <h1 className="text-2xl text-white font-bold">FireVault</h1>
        <div className="bg-rose-600 text-white shadow-md rounded-lg px-24 py-4 mx-52 text-center">
          <p className="sm:text-md lg:text-xl 2xl:text-3xl font-mono font-semibold ">
            Edicion - Reporte de Servicio
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-10">
            <Input
              label="Versión"
              errors={errors}
              nameRegister="version"
              colSpan="3"
              type="text"
              register={register}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <Input
              label="Fecha de elaboración"
              errors={errors}
              nameRegister="fechaElaboracion"
              colSpan="1"
              type="date"
              register={register}
            />
            <Input
              label="Fecha de reporte"
              errors={errors}
              nameRegister="fechaReporte"
              colSpan="1"
              type="date"
              register={register}
            />
            <Input
              label="Numero de reporte"
              errors={errors}
              nameRegister="reporteTecnico"
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="Telefono"
              colSpan="1"
              errors={errors}
              nameRegister="numeroTelefono"
              type="text"
              register={register}
            />
            <Input
              label="Dirección"
              colSpan="1"
              errors={errors}
              nameRegister="direccionLogistica"
              type="text"
              register={register}
            />
            <Input
              label="Ciudad"
              nameRegister="ciudadDepartamento"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />

            <div className="col-span-3">
              <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                1. DATOS DEL EQUIPO
              </p>
            </div>
            <Input
              label="Nombre"
              nameRegister="nombreEquipo"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />
            <Input
              label="Marca"
              nameRegister="nombreMarca"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />
            <Input
              label="Referencia"
              nameRegister="nombreReferencia"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />
            <Input
              label="Modelo"
              nameRegister="nombreModelo"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />
            <Input
              label="Serial"
              nameRegister="nombreSerial"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />
            <Input
              label="No. de Inventario"
              nameRegister="numeroInventario"
              errors={errors}
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="Linea de producto"
              nameRegister="lineaProducto"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />
            <Input
              label="Ubicación"
              nameRegister="ubicacionCirugia"
              colSpan="1"
              errors={errors}
              type="text"
              register={register}
            />

            <div className="col-span-3">
              <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                2. DATOS ENCARGADO DE MANTENIMIENTO
              </p>
            </div>

            <Input
              label="Nombre completo"
              errors={errors}
              nameRegister="nombreMantenimiento"
              colSpan="2"
              type="text"
              register={register}
            />

            <Input
              label="Telefono"
              errors={errors}
              nameRegister="telefonoMantenimiento"
              colSpan="1"
              type="text"
              register={register}
            />

            <Input
              label="Cargo"
              errors={errors}
              nameRegister="cargoMantenimiento"
              colSpan="1"
              type="text"
              register={register}
            />

            <Input
              label="Correo electrónico"
              errors={errors}
              nameRegister="correoMantenimiento"
              colSpan="2"
              type="text"
              register={register}
            />

            <div className="col-span-3">
              <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                3. VERIFICACIÓN DEL ESTADO DEL EQUIPO ANTES DEL MANTENIMIENTO
              </p>
            </div>

            <div className={`col-span-3`}>
              <label className="block text-xl font-mono text-white font-semibold">
                ¿Se ejecutó el proceso de descontaminación?
              </label>
              <select
                label="descontaminacion"
                placeholder="Seleccione un tipo"
                nameRegister="descontaminacion"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("descontaminacion", e.target.value)
                }
                value={selectedOptions.descontaminacion}
              >
                <option value=""></option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="col-span-3">
              <p className="block text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                VERIFICACIÓN DEL ESTADO DEL EQUIPO ANTES DEL MANTENIMIENTO
              </p>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Carcaza
              </label>
              <select
                label="Carcaza"
                placeholder="Seleccione un tipo"
                nameRegister="carcaza"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) => handleSelectChange("carcaza", e.target.value)}
                value={selectedOptions.carcaza}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Accesorios
              </label>
              <select
                label="Accesorios"
                placeholder="Seleccione un tipo"
                nameRegister="accesorios"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("accesorios", e.target.value)
                }
                value={selectedOptions.accesorios}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Conectores
              </label>
              <select
                label="Conectores"
                placeholder="Seleccione un tipo"
                nameRegister="conectores"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("conectores", e.target.value)
                }
                value={selectedOptions.conectores}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Interruptores
              </label>
              <select
                label="Interruptores"
                placeholder="Seleccione un tipo"
                nameRegister="interruptores"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("interruptores", e.target.value)
                }
                value={selectedOptions.interruptores}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Indicador
              </label>
              <select
                label="Indicador"
                placeholder="Seleccione un tipo"
                nameRegister="indicador"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("indicador", e.target.value)
                }
                value={selectedOptions.indicador}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Cargadores
              </label>
              <select
                label="Cargadores"
                placeholder="Seleccione un tipo"
                nameRegister="cargadores"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("cargadores", e.target.value)
                }
                value={selectedOptions.cargadores}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Sistema eléctrico
              </label>
              <select
                label="Sistema eléctrico"
                placeholder="Seleccione un tipo"
                nameRegister="sistemaElectrico"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("sistemaElectrico", e.target.value)
                }
                value={selectedOptions.sistemaElectrico}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Sistema eléctronico
              </label>
              <select
                label="Sistema eléctronico"
                placeholder="Seleccione un tipo"
                nameRegister="sistemaElectronico"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("sistemaElectronico", e.target.value)
                }
                value={selectedOptions.sistemaElectronico}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Medición
              </label>
              <select
                label="Medición"
                placeholder="Seleccione un tipo"
                nameRegister="medicion"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) => handleSelectChange("medicion", e.target.value)}
                value={selectedOptions.medicion}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Empaques
              </label>
              <select
                label="Empaques"
                placeholder="Seleccione un tipo"
                nameRegister="empaques"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) => handleSelectChange("empaques", e.target.value)}
                value={selectedOptions.empaques}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Niveles de alarma
              </label>
              <select
                label="Niveles de alarma"
                placeholder="Seleccione un tipo"
                nameRegister="nivelesAlarma"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) =>
                  handleSelectChange("nivelesAlarma", e.target.value)
                }
                value={selectedOptions.nivelesAlarma}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold">
                Otros
              </label>
              <select
                label="Otros"
                placeholder="Seleccione un tipo"
                nameRegister="otros"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) => handleSelectChange("otros", e.target.value)}
                value={selectedOptions.otros}
              >
                <option value=""></option>
                <option value="B">B</option>
                <option value="R">R</option>
                <option value="M">M</option>
                <option value="N. A.">N. A.</option>
              </select>
            </div>

            <div className="col-span-3">
              <p className="block text-2xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                DESCRIPCIÓN / OBSERVACIONES ADICIONALES
              </p>
            </div>

            <div className="col-span-3">
              <p className="block text-2xl rounded-lg font-mono font-semibold text-white mt-4 text-center">
                ENTREGÓ
              </p>
            </div>
            <Input
              label="Nombre "
              errors={errors}
              nameRegister="nombreEntrego"
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="No. de cedula "
              errors={errors}
              nameRegister="cedulaEntrego"
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="Cargo "
              errors={errors}
              nameRegister="cargoEntrego"
              colSpan="1"
              type="text"
              register={register}
            />

            <div className="col-span-3">
              <label className="block text-xl font-mono text-white font-semibold">
                Firma
              </label>
              <input
                className="bg-white border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                type="file"
                nameRegister="FirmaEntrego"
                accept="image/*"
                {...register("FirmaEntrego")}
              />
            </div>

            <div className="col-span-3">
              <p className="block text-2xl rounded-lg font-mono font-semibold text-white mt-4 text-center">
                RECIBIÓ
              </p>
            </div>
            <Input
              label="Nombre "
              errors={errors}
              nameRegister="nombreRecibio"
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="No. de cedula "
              errors={errors}
              nameRegister="cedulaRecibio"
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="Cargo "
              errors={errors}
              nameRegister="cargoRecibio"
              colSpan="1"
              type="text"
              register={register}
            />

            <div className="col-span-3">
              <label className="block text-xl font-mono text-white font-semibold">
                Firma
              </label>
              <input
                className="bg-white border border-gray-400 rounded-lg px-4 w-full text-gray-600"
                type="file"
                nameRegister="FirmaRecibio"
                accept="image/*"
                {...register("FirmaRecibio")}
              />
            </div>

            <Input
              label="Fecha Inicio "
              errors={errors}
              nameRegister="fechaInicio"
              colSpan="1"
              type="date"
              register={register}
            />
            <Input
              label="Fecha Finalizacion"
              errors={errors}
              nameRegister="fechaFinalizacion"
              colSpan="1"
              type="date"
              register={register}
            />

            <div className={`col-span-1`}>
              <label className="block text-xl font-mono text-white font-semibold mt-2">
                Mantenimiento
              </label>
              <select
                label="Problemas reportados"
                placeholder="Seleccione un tipo"
                nameRegister="mS"
                className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                onChange={(e) => handleSelectChange("mS", e.target.value)}
                value={selectedOptions.mS}
              >
                <option value=""></option>
                <option value="Diagnostico">Diagnostico</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
                <option value="Instalación">Instalación</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <Input
              label="Observaciones"
              nameRegister="observacionesAdicionales"
              errors={errors}
              colSpan="3"
              type="text"
              register={register}
            />
          </div>
          <div className="col-span-3">
            <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
              4. MANTENIMIENTO
            </p>
          </div>

          <p className="block col-span-3 text-xl rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
            Para agregar en la sección de mantenimiento la descripción del
            procedimiento.
          </p>

          {camposAdicionales.map((campo, index) => (
            <div key={index} className="flex-auto">
              <p className="block text-xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mx-72 p-2 text-center mt-4 mb-4">
                Descripcion del procedimiento {`${index}`}
              </p>
              <Input
                label="Prueba / Falla"
                errors={errors}
                nameRegister={`pruebaFalla${index}`}
                type="text"
                register={register}
              />
              <Input
                label="Descripcion"
                errors={errors}
                nameRegister={`descripcionMantenimiento${index}`}
                type="text"
                register={register}
              />
              <Input
                label="Observaciones"
                errors={errors}
                nameRegister={`observacionesMantenimiento${index}`}
                type="text"
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
              Agregar campos de mantenimiento
            </button>
          </div>

          <div className={`col-span-1`}>
            <label className="block text-xl font-mono text-white font-semibold mt-2">
              Problemas reportados
            </label>
            <select
              label="Problemas reportados"
              placeholder="Seleccione un tipo"
              nameRegister="pR"
              className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
              onChange={(e) => handleSelectChange("pR", e.target.value)}
              value={selectedOptions.pR}
            >
              <option value=""></option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Electrónico">Electrónico</option>
              <option value="Mecánico">Mecánico</option>
              <option value="Conexión">Conexión</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Operativo">Operativo</option>
              <option value="No aplica">No aplica</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="col-span-3">
            <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
              5. CONCLUSIONES
            </p>
          </div>

          <div className={`col-span-1`}>
            <label className="block text-xl font-mono text-white font-semibold mt-4">
              Estado final del equipo
            </label>
            <select
              label="Problemas reportados"
              placeholder="Seleccione un tipo"
              nameRegister="eFQ"
              className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
              onChange={(e) => handleSelectChange("eFQ", e.target.value)}
              value={selectedOptions.eFQ}
            >
              <option value=""></option>
              <option value="Apto para uso">Apto para uso</option>
              <option value="Requiere repuestos">Requiere repuestos</option>
              <option value="Fuera de servicio">Fuera de servicio</option>
            </select>
          </div>

          <div className="col-span-3">
            <p className="block text-2xl rounded-lg font-mono font-semibold text-white mt-4 text-center">
              Repuestos requeridos
            </p>
          </div>

          <p className="block col-span-3 text-xl rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
            Para agregar en la sección de repuestos requeridos presiones el
            boton para agregar los campos.
          </p>

          {camposAdicionalesR.map((campo, index) => (
            <div key={index} className="flex-auto">
              <p className="block text-xl border-dashed border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mx-72 p-2 text-center mt-4 mb-4">
                Repuestos requeridos {`${index}`}
              </p>

              <Input
                label="Cantidad"
                nameRegister={`cantidadRepuestos${index}`}
                errors={errors}
                type="text"
                register={register}
              />

              <Input
                label="Descripción Repuestos"
                nameRegister={`descripcionRepuestos${index}`}
                errors={errors}
                type="text"
                register={register}
              />

              <Input
                label="Referencia Repuestos"
                nameRegister={`referenciaRepuestos${index}`}
                errors={errors}
                colSpan="3"
                type="text"
                register={register}
              />

              {/* Renderiza otros campos similares aquí */}
            </div>
          ))}

          {/* Botón para agregar más campos */}
          <div className="w-full mb-4">
            <button
              type="button"
              onClick={agregarCampoR}
              className="w-full my-5 py-2 bg-gray-400 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg"
            >
              Agregar campos de repuestos requeridos
            </button>
          </div>

          <Input
            label="Nota"
            nameRegister="notaRepuestos"
            errors={errors}
            colSpan="3"
            type="text"
            register={register}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="col-span-3">
              <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                6. RECOMENDACIONES DE USO
              </p>
            </div>
            <Input
              label="Recomendaciones de uso"
              nameRegister="recomendacionesUso"
              errors={errors}
              colSpan="3"
              type="text"
              register={register}
            />

            <div className="col-span-3">
              <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                7. OBSERVACIONES FINALES
              </p>
            </div>
            <Input
              label="Observaciones finales"
              nameRegister="observacionesFinales"
              errors={errors}
              colSpan="3"
              type="text"
              register={register}
            />
            <div className="col-span-3">
              <p className="block text-3xl border-solid border-2 border-gray-200 rounded-lg font-mono font-semibold text-white mt-6 p-2 text-center">
                8. RESPONSABLE DE SOPORTE DE MANTENIMIENTO
              </p>
            </div>
            <Input
              label="Nombre completo"
              nameRegister="nombreResponsable"
              errors={errors}
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="Numero de recurso humano"
              nameRegister="numeroRecursoHumano"
              errors={errors}
              colSpan="1"
              type="text"
              register={register}
            />
            <Input
              label="Cargo"
              nameRegister="cargoResponsable"
              errors={errors}
              colSpan="1"
              type="text"
              register={register}
            />
          </div>

          <div className="col-span-3">
            <label className="block text-xl font-mono text-white font-semibold">
              Firma
            </label>
            <input
              className="bg-white border border-gray-400 rounded-lg px-4 w-full text-gray-600"
              type="file"
              nameRegister="FirmaResponsable"
              accept="image/*"
              {...register("FirmaResponsable")}
            />
          </div>

          <div className="mt-8" />

          <div className="flex relative w-full text-gray-400 py-2">
            <button className="w-full my-5 py-2 text-2xl bg-gray-400 hover:shadow-gray-500/50 duration-150 hover:shadow-lg hover:shadow-teal text-gray-800 font-bold rounded-lg">
              Agregar
            </button>
          </div>

          <div className="mb-4" />
        </form>
      </div>
    </CardComponent>
  );
};

export default EditRS;
