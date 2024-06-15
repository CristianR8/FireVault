import React from "react";
import { PiFilePdf } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import { query, where, getDocs, collection } from "firebase/firestore";
import { firestore, storage } from "../firebase";
import { getDownloadURL, ref, deleteObject, uploadBytes } from 'firebase/storage'

export const ButtonPdf = ({ setModal, name, folder }) => {
  console.log(name);
  console.log("hola");

  const downloadDocxFromFirestore = async () => {
    try {


            // 2. Una vez que obtienes el nombre del archivo desde Firestore, usa ese nombre para obtener el enlace de descarga desde Firebase Storage.
            const storageRef = ref(storage, `database/${folder}/${name}`);
            const downloadURL = await getDownloadURL(storageRef);

            // 3. Usa ese enlace para descargar el archivo.
            window.location.href = downloadURL;

    } catch (error) {
        console.error("Error fetching .docx file:", error);
    }
}


  return (
    <div className="justify-items-center w-screen">
      <div className="grid grid-cols-1">
        <button
          onClick={() => {
            if (name.endsWith('.docx')) {
                downloadDocxFromFirestore();
            } else {
                setModal(true);
            }
        }}

          className="px-72 py-2.5 pl-32 group w-screen overflow-hidden font-semibold bg-gray-900 text-white relative mb-16"
        >
          <span className="absolute w-full top-0 left-0 flex h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-gray-50 group-hover:h-full">
            {" "}
            <PiFilePdf className="absolute inset-y-3 left-3 h-6 w-6 2xl:h-10 2xl:w-10 2xl:inset-y-2 text-white group-hover:text-gray-900 " />
          </span>
          <span className="relative group-hover:text-gray-900 2xl:text-2xl">
            {" "}
            {name}{" "}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ButtonPdf;