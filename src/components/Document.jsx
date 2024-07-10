import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardComponent from "./CardComponent";
import Return from "./Return";
import ButtonPdf from "./ButtonPdf";
import Modal from "./Modal";
import { firestore, storage } from "../firebase";
import {
  getDownloadURL, ref, deleteObject, uploadBytes
} from "firebase/storage";
import { Tooltip } from "react-tooltip";
import { LuClipboardEdit } from "react-icons/lu";
import { FaFileWaveform } from "react-icons/fa6";
import { AiOutlineUpload } from "react-icons/ai";
import { MdEditDocument } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";
import Spinner from "./Spinner";
import { AiOutlineLogout } from "react-icons/ai";

const Document = () => {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const { title, name, name2, folder, code } = state;

  const [filename, setFilename] = useState(name);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  useEffect(() => {
    getDownloadURL(ref(storage, `database/${folder}/${filename}`)).then(
      (url) => {
        setResume(url);
      }
    );
  }, [folder, filename]);

  const [resume2, setResume2] = useState(null);
  const [filename2, setFilename2] = useState(name2);
  useEffect(() => {
    getDownloadURL(ref(storage, `database/rps/${filename2}`)).then((url) => {
      setResume2(url);
    });
  }, [filename2]);

  const handleDelete = async (folder) => {
    setLoading(true);
    let storageRef;
    console.log("Filename:", filename);
    console.log("Filename2:", filename2);

    if (folder === "hv") {
      storageRef = ref(storage, `database/${folder}/${filename}`);
    } else {
      storageRef = ref(storage, `database/${folder}/${filename}`);
    }

    if (folder === "rps") {
      storageRef = ref(storage, `database/${folder}/${filename2}`);
    } else {
      storageRef = ref(storage, `database/${folder}/${filename}`);
    }

    await deleteObject(storageRef);
    const docRef = doc(firestore, "productos", String(code));
    await updateDoc(docRef, { [folder]: "" });
    setLoading(false);
    navigate("/documentation");
  };

  console.log(code);

  const navigate = useNavigate();

  const handleReturn = async () => {
    navigate("/documentation");
  };

  const handleFileChange = async (e, folder) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);

      const storageRef = ref(storage, `database/${folder}/${file.name}`);

      try {
        if (folder === "hv" && filename) {
          const storageref2 = ref(storage, `database/${folder}/${filename}`);
          await deleteObject(storageref2);
        } else if (folder === "rps" && filename2) {
          const storageref2 = ref(storage, `database/${folder}/${filename2}`);
          await deleteObject(storageref2);
        }
      } catch (error) {
        console.error("Error al eliminar el archivo anterior:", error);
      }

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const docRef = doc(firestore, "productos", String(code));
        await updateDoc(docRef, { [folder]: file.name });

        if (folder === "rps") {
          setFilename2(file.name);
        } else {
          setFilename(file.name);
        }
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }
      setLoading(false);
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <CardComponent>
      <div className="flex justify-between items-center w-full p-4">
        <h1 className="text-2xl text-white font-bold">FireVault</h1>
        <div className="bg-rose-600 text-neutral-900 shadow-md rounded-lg px-8 mx-52 text-center">
          <p className="sm:text-xl lg:text-3xl 2xl:text-5xl font-mono font-semibold ">
            {title}
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

      <div className="flex flex-col items-start mx-16 overflow-hidden">
        <label className="text-white my-16 font-semibold text-lg 2xl:text-2xl p-2 rounded-lg">
          DOCUMENTOS DISPONIBLES:
        </label>

        {!filename ? (
          <>
            <label className="text-white text-xl 2xl:text-2xl text-center mx-auto">
              No hay archivos aún en este producto
            </label>

            <input
              type="file"
              style={{ display: "none" }}
              accept=".pdf" // Para solo permitir archivos PDF
              onChange={(e) => handleFileChange(e, folder)}
              ref={inputRef} // Añadiré cómo definir esta referencia a continuación
            />
            <button
              data-tooltip-id="botonUpload"
              className="text-white text-base md:text-md flex items-center justify-center absolute bottom-0 right-32 2xl:right-40 m-5"
              onClick={() => inputRef.current.click()}
            >
              <AiOutlineUpload className="md:h-14 md:w-14 2xl:h-16 2xl:w-16 hover:scale-110 duration-200"></AiOutlineUpload>
              <Tooltip id="botonUpload" effect="float">
                Subir archivo
              </Tooltip>
            </button>
          </>
        ) : (
          <div>
            {folder === "hv" && (
              <>
                {filename && (
                  <div className="flex justify-center x-2">
                    <ButtonPdf
                      setModal={setModal}
                      resume={resume}
                      name={filename}
                      folder="hv"
                    />
                    {modal === true && (
                      <Modal setModal={setModal} resume={resume} />
                    )}

                    <div className="flex justify-center space-x-4">
                      <label className="text-gray-950 md:text-md lg:text-lg flex items-center justify-center absolute bottom-40 right-96 mt-6">
                        Hoja de vida:
                      </label>

                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept=".pdf" // Para solo permitir archivos PDF
                        onChange={(e) => handleFileChange(e, folder)}
                        ref={inputRef2} // Añadiré cómo definir esta referencia a continuación
                      />
                      <button
                        data-tooltip-id="botonUploadhv"
                        className="text-gray-950 text-base md:text-md flex items-center justify-center absolute bottom-32 right-72 2xl:right-80 mb-6"
                        onClick={() => inputRef2.current.click()}
                      >
                        <AiOutlineUpload className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></AiOutlineUpload>
                        <Tooltip id="botonUploadhv" effect="float">
                          Subir archivo - Hoja de vida
                        </Tooltip>
                      </button>

                      <Link
                        to="/edit-hv"
                        state={{
                          title: title,
                          folder: folder,
                          code: String(code),
                          name2: name2,
                        }}
                      >
                        <button
                          data-tooltip-id="botonFill"
                          className="text-gray-950 text-base md:text-md flex items-center justify-center absolute bottom-32 right-56 2xl:right-64 mb-6"
                        >
                          <FaFileWaveform className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></FaFileWaveform>

                          <Tooltip id="botonFill" effect="float">
                            Rellenar formulario - Hoja de vida
                          </Tooltip>
                        </button>
                      </Link>

                      {filename.endsWith("docx") && (
                        <Link
                          to="/edit-hv"
                          state={{
                            title: title,
                            name: name,
                            folder: folder,
                            code: String(code),
                            name2: name2,
                          }}
                        >
                          <button
                            data-tooltip-id="botonTooltipEdithv"
                            className="text-gray-950 text-base md:text-md flex items-center justify-center absolute bottom-32 right-40 2xl:right-48 mb-6"
                          >
                            <MdEditDocument className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></MdEditDocument>
                            <Tooltip id="botonTooltipEdithv" effect="float">
                              Editar hoja de vida
                            </Tooltip>
                          </button>
                        </Link>
                      )}

                      <button
                        data-tooltip-id="botonTooltipDeletehv"
                        className="z-0 text-gray-950 text-base md:text-md flex items-center justify-center absolute bottom-32 right-24 2xl:right-32 mb-6 "
                        onClick={() => handleDelete("hv")}
                      >
                        <RiDeleteBin5Fill className="z-0 md:h-6 md:w-6 lg:h-10 lg:w-10  2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></RiDeleteBin5Fill>
                        <Tooltip id="botonTooltipDeletehv" effect="float">
                          Eliminar hoja de vida
                        </Tooltip>
                      </button>
                    </div>
                  </div>
                )}

                {filename2 && (
                  <div className="flex justify-center space-x-4">
                    <ButtonPdf
                      setModal={setModal2}
                      resume={resume2}
                      name={filename2}
                      folder="rps"
                    />
                    {modal2 && <Modal setModal={setModal2} resume={resume2} />}

                    <label className="text-gray-950 md:text-md lg:text-lg flex items-center justify-center absolute bottom-24 right-96 mt-6">
                      Reporte de servicio:
                    </label>

                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept=".pdf" // Para solo permitir archivos PDF
                      onChange={(e) => handleFileChange(e, "rps")}
                      ref={inputRef} // Añadiré cómo definir esta referencia a continuación
                    />

                    <button
                      data-tooltip-id="botonUpload"
                      className="text-gray-800 text-base md:text-md flex items-center justify-center absolute bottom-20 right-72 2xl:right-80 mt-6"
                      onClick={() => inputRef.current.click()}
                    >
                      <AiOutlineUpload className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></AiOutlineUpload>
                      <Tooltip id="botonUpload" effect="float">
                        Subir archivo - Reporte de servicio
                      </Tooltip>
                    </button>

                    <Link
                      to="/edit-rs"
                      state={{
                        title: title,
                        name: name,
                        folder: folder,
                        code: String(code),
                      }}
                    >
                      <button
                        data-tooltip-id="botonFillrs"
                        className="text-gray-800 text-base md:text-md flex items-center justify-center absolute bottom-20 right-56 2xl:right-64 mt-6"
                      >
                        <FaFileWaveform className="md:h-6 md:w-6 lg:h-10 lg:w-10  2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></FaFileWaveform>
                        <Tooltip id="botonFillrs" effect="float">
                          Rellenar formulario - Reporte de servicio
                        </Tooltip>
                      </button>
                    </Link>

                    {filename2.endsWith("docx") && (
                      <Link
                        to="/edit-rs"
                        state={{
                          title: title,
                          name: name,
                          folder: folder,
                          code: String(code),
                          name2: name2,
                        }}
                      >
                        <button
                          data-tooltip-id="botonTooltipEditrs"
                          className="text-gray-800 text-base md:text-md flex items-center justify-center absolute bottom-20 right-40 2xl:right-48 mt-6"
                        >
                          <LuClipboardEdit className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></LuClipboardEdit>
                          <Tooltip id="botonTooltipEditrs" effect="float">
                            Editar reporte de servicio
                          </Tooltip>
                        </button>
                      </Link>
                    )}

                    <button
                      data-tooltip-id="botonTooltipDeleters"
                      className="z-0 text-gray-800 text-base md:text-md flex items-center justify-center absolute bottom-20 right-24 2xl:right-32 mt-6 "
                      onClick={() => handleDelete("rps")}
                    >
                      <RiDeleteBin5Fill className="z-0 md:h-6 md:w-6 lg:h-10 lg:w-10  2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></RiDeleteBin5Fill>
                      <Tooltip id="botonTooltipDeleters" effect="float">
                        Eliminar reporte de servicio
                      </Tooltip>
                    </button>
                  </div>
                )}

                {!filename2 && (
                  <>
                    <label className="text-gray-950 md:text-md lg:text-lg flex items-center justify-center absolute bottom-24 right-96 mt-6">
                      Reporte de servicio:
                    </label>

                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "rps")}
                      ref={inputRef}
                    />

                    <button
                      data-tooltip-id="botonUpload"
                      className="text-gray-800 text-base md:text-md flex items-center justify-center absolute bottom-20 right-40 2xl:right-48 mt-6"
                      onClick={() => inputRef.current.click()}
                    >
                      <AiOutlineUpload className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></AiOutlineUpload>
                      <Tooltip id="botonUpload" effect="float">
                        Subir archivo - Reporte de servicio
                      </Tooltip>
                    </button>
                    <Link
                      to="/edit-rs"
                      state={{
                        title: title,
                        name: name,
                        folder: folder,
                        code: String(code),
                      }}
                    >
                      <button
                        data-tooltip-id="botonFillrs"
                        className="z-0 text-gray-800 text-base md:text-md flex items-center justify-center absolute bottom-20 right-24 2xl:right-32 mt-6 "
                      >
                        <FaFileWaveform className="md:h-6 md:w-6 lg:h-10 lg:w-10 2xl:h-14 2xl:w-14 hover:scale-110 duration-200"></FaFileWaveform>
                        <Tooltip id="botonFillrs" effect="float">
                          Rellenar formulario - Reporte de servicio
                        </Tooltip>
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}

            {folder !== "hv" && filename && (
              <>
                <ButtonPdf setModal={setModal} name={filename} />
                {modal === true && (
                  <Modal setModal={setModal} resume={resume} />
                )}
                <>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, folder)}
                    ref={inputRef}
                  />

                  <button
                    data-tooltip-id="botonUpload"
                    className="text-gray-900 text-base md:text-md flex items-center justify-center absolute bottom-0 right-48 2xl:right-56 m-5"
                    onClick={() => inputRef.current.click()}
                  >
                    <AiOutlineUpload className="md:h-14 md:w-14 2xl:h-16 2xl:w-16 hover:scale-110 duration-200"></AiOutlineUpload>
                    <Tooltip id="botonUpload" effect="float">
                      Subir archivo
                    </Tooltip>
                  </button>
                  <button
                    data-tooltip-id="botonTooltipDelete"
                    className="z-0 text-gray-900 text-base md:text-md flex items-center justify-center absolute bottom-0 right-32 2xl:right-36 m-5"
                    onClick={() => handleDelete(folder)}
                  >
                    <RiDeleteBin5Fill className="z-0 md:h-14 md:w-14 2xl:h-16 2xl:w-16 hover:scale-110 duration-200"></RiDeleteBin5Fill>
                    <Tooltip id="botonTooltipDelete" effect="float">
                      Eliminar documento
                    </Tooltip>
                  </button>
                </>
              </>
            )}
          </div>
        )}
      </div>
    </CardComponent>
  );
};

export default Document;
