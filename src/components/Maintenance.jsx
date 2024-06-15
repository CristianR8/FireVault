import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import MntFormProduct from "./MntFormProduct";
import { AiOutlineWarning, AiOutlineCheck } from "react-icons/ai";
import { firestore, storage } from "../firebase";
import { Tooltip } from "react-tooltip";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  deleteField
} from "firebase/firestore"; // Importa collection solo una vez
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import Return from "./Return";
import { useAuth } from "../context/authContext";

const Maintenance = () => {
  const [report, setReport] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleReturn = async () => {
    navigate("/module");
  };

  const onSubmitFunction = async (data) => {
    let { codigo, fecha } = data;
    await updateDoc(doc(firestore, "productos", String(codigo)), {
      maintenance: fecha,
    });
    retrieveData();
  };

  const calculateSemaforizacion = (fecha) => {
    const months = {
      Enero: 1,
      Febrero: 2,
      Marzo: 3,
      Abril: 4,
      Mayo: 5,
      Junio: 6,
      Julio: 7,
      Agosto: 8,
      Septiembre: 9,
      Octubre: 10,
      Noviembre: 11,
      Diciembre: 12,
    };

    let today = new Date();
    let currentMonth = today.getMonth() + 1;

    return currentMonth === months[fecha]
      ? today.getDate() < 20
        ? "verde"
        : "amarillo"
      : currentMonth < months[fecha]
        ? "verde"
        : "rojo";
  };

  const retrieveData = async () => {
    let q;
    if (filter !== "Todos") {
      q = query(
        collection(firestore, "productos"),
        where("maintenance", "==", filter)
      );
    } else { q = collection(firestore, "productos") }

    const querySnapshot = await getDocs(q);

    let data = querySnapshot.docs.filter((doc) => {
      return doc.data().maintenance !== undefined;
    }).map((doc) => {
      let type_semf = calculateSemaforizacion(doc.data().maintenance);
      return { ...doc.data(), semaforizacion: type_semf };
    });

    setReport(data);
  };

  const removeMaintenance = async (codigo) => {
    console.log(codigo)
    Swal.fire({
      title: '¿Estas seguro?',
      text: "¡Esta acción removerá el producto de la tabla de mantenimiento!",
      icon: 'warning',
      showDenyButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#d33',
      confirmButtonText: 'Si, completar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(doc(firestore, "productos", String(codigo)), {
          maintenance: deleteField()
        });
        Swal.fire(
          '¡Mantenimiento completado!',
          'Se ha completado el mantenimiento.',
          'success'
        )
        retrieveData();
      }
    })


  };

  useEffect(() => {
    retrieveData();
  }, [filter]);


  return (
    <CardComponent>
      <div className="bg-gray-800 shadow-md text-white rounded-lg p-4 text-center">
        <p className="text-3xl 2xl:text-4xl font-mono font-semibold ">
          {" "}
          BIENVENIDO AL MÓDULO DE CRONOGRAMA DE MANTENIMIENTO{" "}
        </p>
      </div>
      <div className="flex justify-items-center">
        <div className="w-full h-full gap-0 items-center align-middle ">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <MntFormProduct onSubmitFn={onSubmitFunction} />

            <div className='max-w-[400px]-w-full h-full py-16 bg-gray-50 px-8 rounded-lg my-4 mr-4'>
              <label className="block bg-gray-900 text-white shadow-md rounded-full p-3 mb-5 text-center text-lg font-mono font-semibold">
                Próximos mantenimientos
              </label>
              <label className="flex items-center justify-center text-gray-800 font-semibold my-8 text-lg ">
                Mes:
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-4"
                >
                  <option>Todos</option>
                  <option>Enero</option>
                  <option>Febrero</option>
                  <option>Marzo</option>
                  <option>Abril</option>
                  <option>Mayo</option>
                  <option>Junio</option>
                  <option>Julio</option>
                  <option>Agosto</option>
                  <option>Septiembre</option>
                  <option>Octubre</option>
                  <option>Noviembre</option>
                  <option>Diciembre</option>
                </select>
              </label>

              <div className="flex flex-col max-h-[250px]overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-stone-200">
                <table className="table-auto items-center">
                  <thead className="text-center justify-center items-center text-sm font-bold text-gray-900 uppercase">
                    <tr>
                      <th className="px-4">Bodega</th>
                      <th className="px-8">Código</th>
                      <th>Nombre</th>
                      <th className="px-4">Fecha</th>
                      <th className="px-2">
                        <AiOutlineWarning data-tooltip-id="botonInfo" className="w-10 h-10" />
                        <Tooltip id="botonInfo" style={{ height: '170px', width: '300px' }} effect="float">
                          <span className="flex items-center my-2">
                            <div className="w-10 h-10 rounded-full bg-green-400"></div>
                            <label className="ml-8">Mantenimiento disponible</label>
                          </span>
                          <span className="flex items-center my-2">
                            <div className="w-10 h-10 rounded-full bg-yellow-300"></div>
                            <label className="ml-2">Mantenimiento pronto a vencer</label>
                          </span>
                          <span className="flex items-center my-2">
                            <div className="w-10 h-10 rounded-full bg-red-500"></div>
                            <label className="ml-8">Mantenimiento atrasado</label>
                          </span>



                        </Tooltip>
                      </th>
                      <th>
                        ¿Completado?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((item, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-900 hover:text-white transition duration-200 group`}
                      >
                        <td className="text-center whitespace-normal max-h-16">
                          {item.ciudad}
                        </td>
                        <td className="text-center whitespace-normal max-h-16	">
                          {item.codigo}
                        </td>
                        <td className="text-center whitespace-normal max-h-16	">
                          {item.nombre}
                        </td>
                        <td className="text-center whitespace-normal max-h-16	">
                          {item.maintenance}
                        </td>
                        <td className=" whitespace-nowrap">
                          <span
                            className={`w-10 h-10 m-2 rounded-full inline-block ${item.semaforizacion === "verde"
                              ? "bg-green-400"
                              : item.semaforizacion === "amarillo"
                                ? "bg-yellow-300"
                                : "bg-red-500"
                              }`}
                          ></span>
                        </td>
                        <td className="text-center whitespace-normal max-h-16 items-center justify-center">
                          <button
                            className="hover:bg-gray-700 hover:shadow-white text-gray-800 font-bold rounded-lg p-2 hover:scale-125 duration-200  "
                            type="button"
                            onClick={() => removeMaintenance(item.codigo)}
                          >

                            <AiOutlineCheck size={32} className="group-hover:fill-white" />
                          </button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Return onClick={handleReturn} />
    </CardComponent>
  );
};

export default Maintenance;
