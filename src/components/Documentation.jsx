import React, { useState, useEffect } from "react";
import CardComponent from "./CardComponent";
import SearchResults from "./SearchResults";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Swal from 'sweetalert2'

import { useAuth } from "../context/authContext";


import Select from "react-select";
import {
  FaFileAlt,
  FaFileSignature,
  FaAddressBook,
  FaBook,
  FaFileInvoice,
  FaHandSparkles,
  FaPlusSquare,
} from "react-icons/fa";
import DocsCard from "./DocsCard";
import Return from "./Return";
import { firestore, storage } from "../firebase";
import useSearchStore from '../store/searchStore'
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

const Documentation = () => {
  const [result, setResult] = useState([]);
  const [searchResultsByName, setSearchResultsByName] = useState([]);
  const { search, filter, setSearch } = useSearchStore()

  const { user, logout } = useAuth();

  const suppliers = [
    { value: "1", label: "Código" },
    { value: "2", label: "Nombre" },
  ]

  const [searchErrorMessage, setSearchErrorMessage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate()

  const handleAddProduct = async () => {
    navigate("/add-product");
  };

  const handleReturn = async () => {
    setSearch("")
    navigate("/module");
  };

  const handleSelectChange = (e) => {
    setSearch(search, e)
  };

  const handleNameCardClick = (codigo) => {
    setSearch(codigo); // Establece el valor de búsqueda al código
    setSearchType(suppliers[0]); // Cambia el filtro a "Código"
    handleSubmit(); // Realiza la búsqueda por código en la misma página
  };

  const [searchType, setSearchType] = useState(suppliers[0]);


  const searchProductByCode = async (product, filter) => {

    const docRef = doc(firestore, "productos", String(product));
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())

    if (docSnap.exists()) {
      setResult(docSnap.data());
      setSearch(product, filter)
    }

  }

  const searchProductByName = async (product, filter) => {
    const q = query(
      collection(firestore, "productos"),
      where("nombre", ">=", product),
      where("nombre", "<=", product + 'z')
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    const searchResults = [];
    querySnapshot.forEach((doc) => {
      searchResults.push(doc.data());

    });

    if (searchResults.length > 0) {
      setSearch(product, filter)
      setResult(searchResults);

    }
  }

  const handleSubmit = async (e) => {
    setResult([])
    e.preventDefault();

    if (!search) {
      setSearchErrorMessage("Ingrese un valor de búsqueda")
      return
    }

    if (searchErrorMessage) setSearchErrorMessage(null);

    console.log(filter)

    if (filter.value === "1") {
      // Búsqueda por ID
      searchProductByCode(search, filter);
      setHasSearched(true);

    } else if (filter.value === "2") {
      // Búsqueda por nombre

      const q = query(
        collection(firestore, "productos"),
        where("nombre", "==", search) // Busca por el atributo "nombre"
      );
      const querySnapshot = await getDocs(q);

      const searchResults = [];
      querySnapshot.forEach((doc) => {
        searchResults.push(doc.data());
      });

      if (searchResults.length > 0) {
        setResult(searchResults);
        
      } else {
        // Manejar el caso en que no se encuentren resultados
        setResult([]);
        setSearchResultsByName(searchResults);

      }
      searchProductByName(search, filter)
      setHasSearched(true);

    }

  };

  useEffect(() => {
    if (search) {
      console.log(search, filter);
      searchProductByCode(search, filter);
      setHasSearched(true);
      
    }
    else setSearch("")


  }, [])

  return (
    <CardComponent>
      <div>
        <div className="bg-gray-800 text-white shadow-md rounded-lg px-8 p-4 mx-52 text-center">
          <p className="text-3xl font-mono 2xl:text-4xl font-semibold ">
            {" "}
            BIENVENIDO AL MÓDULO DE DOCUMENTACIÓN{" "}
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <label className="block text-gray-900 text-2xl 2xl:text-3xl font-mono font-semibold mt-4 mb-2 mr-10">
            Búsqueda de productos
          </label>
          <form
            onSubmit={(e) => {
              handleSubmit(e);

            }}
            className="flex items-center"
          >
            <Select
              options={suppliers}
              onChange={handleSelectChange}
              placeholder="Filtro"
              className="w-80 mt-4 mr-3 mb-4 2xl:w-96"
              value={filter}
            />
            <input
              style={{ fontSize: "16px", verticalAlign: "middle", margin: "0" }}
              className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Digita el código o el nombre del producto aqui"
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="w-10 h-10 2xl:w-24 2xl:h-24 ml-3 hover:scale-125 duration-200 text-gray-900 rounded-md"
            >
              <BsSearch className="w-6 h-6" />
            </button>
          </form>

          {searchErrorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {searchErrorMessage} </span>
            </div>
          )}

        </div>
      </div>

      {result.length !== 0 && (

        <div className="container mt-4">
          <SearchResults searchResults={result} />

        </div>
      )}

      {searchResultsByName.length !== 0 && (
        <div className="containter mt-4">
          <ul>
            setHasSearched(true);
            {searchResultsByName.map((item, index) => (
              <li key={index}>{item.nombre}</li>
            ))}
          </ul>

        </div>
      )}

      <div className="absolute" style={{ right: 0, bottom: 4 }}>

        {hasSearched === false && !search && user.role == "admin" && (

          <button
            data-tooltip-id="botonTooltipAdd"
            className="text-gray-900 text-base md:text-md flex items-center justify-center absolute bottom-0 right-32 2xl:right-44 m-5"
          >
            <FaPlusSquare className="z-0 md:h-14 md:w-14 2xl:h-16 2xl:w-16 hover:scale-110 duration-200" onClick={handleAddProduct} />
            <Tooltip id="botonTooltipAdd" effect="float">

              Agregar documento
            </Tooltip>
          </button>
        )}
      </div>

      <Return onClick={handleReturn} />

    </CardComponent>
  );
};

export default Documentation;