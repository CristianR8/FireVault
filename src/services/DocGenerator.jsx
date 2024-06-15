
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import {  ref, uploadBytes } from 'firebase/storage';
import { storage } from "../firebase.jsx"
import ImageModule from "docxtemplater-image-module-free";

const base64DataURLToArrayBuffer = (dataURL) => {
    console.log("hola")
    const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
    console.log(dataURL)
    if (!base64Regex.test(dataURL)) {
      return false;
    }
    const stringBase64 = dataURL.replace(base64Regex, "");
    let binaryString;
    if (typeof window !== "undefined") {
      binaryString = window.atob(stringBase64);
    } else {
      binaryString = new Buffer(stringBase64, "base64").toString("binary");
    }
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    console.log(bytes.buffer)
    return bytes.buffer;
  }
  

const uploadToFirebase = async (blob, pdfName, folder) => {
    const storageRef = ref(storage, `database/${folder}/${pdfName}`);
    try {
        const snapshot = await uploadBytes(storageRef, blob);
        console.log('Uploaded a blob:', snapshot);
    } catch (error) {
        console.error('Error uploading the file:', error);
    }
};

export const DocGenerator = async (templateName, jsonData, pdfName, folder ) =>  {
        console.log(pdfName)
        try {

            const response = await fetch(`/assets/${templateName}.docx`);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            const zip = new PizZip(arrayBuffer);
            var doc = new Docxtemplater();
            
            const opts = {
                getImage(tag) {
                  return base64DataURLToArrayBuffer(tag);
                },
                getSize() {
                  return [100, 100];
                },
              };

            let imageModule = new ImageModule(opts);
            doc.loadZip(zip);
            doc.attachModule(imageModule);
    
            doc.setData(jsonData) // {"imagenesEquipo" : base64}

            try {
                doc.render();
            } catch (error) {
                console.error("Error durante el procesamiento del documento:", error);
                return;
            }

            const output = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            // Now, let's upload this blob to Firebase Storage
            await uploadToFirebase(output, pdfName, folder);
        } catch (err) {
            console.error("Error fetching the template or generating the document:", err);
        }
    };
