import React, { useState } from 'react';
import DocsCard from "./DocsCard";
import { useNavigate } from "react-router-dom";

import {
  FaFileAlt,
  FaFileSignature,
  FaAddressBook,
  FaBook,
  FaFileInvoice,
  FaHandSparkles,
  FaPlusSquare,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import NameCard from "./NameCard"
import useSearchStore from '../store/searchStore'

const SearchResults = ({ searchResults }) => {
  const [selectedObject, setSelectedObject] = useState(searchResults);
  const { search, filter, setSearch } = useSearchStore()
  const navigate = useNavigate();

  const handleNameCardClick = (codigo) => {
    // Establecer el objeto seleccionado en función del código
    const selectedResult = searchResults.find(result => result.codigo === codigo);
    setSelectedObject(selectedResult);


    setSearch(selectedResult.codigo, { value: "1", label: "Código" })

  };



  return (
    <>

      {searchResults.constructor === Array && selectedObject.constructor != Object &&
        <div className='justify-items-center w-screen'>
          <div className='grid grid-cols-1 px-64 items-center gap-4'>
            {searchResults.map((result, index) => (
              <NameCard to={index} title={result.nombre} codigo={result.codigo} onClick={() => handleNameCardClick(result.codigo)} />
            ))}
          </div>
        </div>
      }
      {selectedObject.constructor === Object &&
        <div className='justify-items-center w-screen'>
          <div className="grid grid-cols-2 pr-12 items-center gap-4">

            <DocsCard
              title="Hoja de vida equipo"
              url={selectedObject.hv}
              url2={selectedObject.rps}
              folder='hv'
              icon={<FaFileAlt />}
              to="/documentation/hoja-de-vida"
              code={selectedObject.codigo}
            />

            <DocsCard
              title="Guía de manejo rápido"
              url={selectedObject.gmr}
              folder='gmr'
              icon={<FaFileInvoice />}
              to="/documentation/guia-de-manejo-rapido"
              code={selectedObject.codigo}
            />

            <DocsCard
              title="Ficha técnica"
              url={selectedObject.ft}
              folder='ft'
              icon={<FaFileSignature />}
              to="/documentation/ficha-tecnica"
              code={selectedObject.codigo}
            />

            <DocsCard
              title="Manual de usuario"
              url={selectedObject.mu}
              folder='mu'
              icon={<FaBook />}
              to="/documentation/manual-de-usuario"
              code={selectedObject.codigo}
            />

            <DocsCard
              title="Hoja de vida personal"
              url={selectedObject.hvp}
              folder='hvp'
              icon={<FaAddressBook />}
              to="/documentation/hoja-de-vida-personal"
              code={selectedObject.codigo}
            />

            <DocsCard
              title="Protocolo de limpieza"
              url={selectedObject.ptl}
              folder='ptl'
              icon={<FaHandSparkles />}
              to="/documentation/protocolo-de-limpieza"
              code={selectedObject.codigo}
            />

          </div>

        </div>
      }
    </>
  )
}

export default SearchResults