const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs").promises;
const os = require("os");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

admin.initializeApp();

exports.convertDocxToPdf = functions.storage.object().onFinalize(async (object) => {
    // Verificar si el archivo es un .docx
    if (!object.name.endsWith('.docx')) {
        return null;
    }

    const bucket = admin.storage().bucket();
    const fileName = path.basename(object.name); // Solo el nombre del archivo, sin carpetas
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const tempOutputPath = path.join(os.tmpdir(), fileName.replace('.docx', '.pdf'));
    console.log(fileName)
    console.log(tempFilePath)

    // Descargar el archivo .docx a una ruta temporal
    await bucket.file(object.name).download({ destination: tempFilePath });

    // Leer el archivo
    const docxBuf = await fs.readFile(tempFilePath, 'binary')

    // Convertirlo a formato PDF
    const pdfBuf = await libre.convertAsync(docxBuf, '.pdf', undefined);

    // Guardar el archivo PDF en una ruta temporal
    await fs.writeFile(tempOutputPath, pdfBuf);

    // Subir el archivo PDF al storage
    await bucket.upload(tempOutputPath, {
        destination: object.name.replace('.docx', '.pdf')
    });

    // Eliminar el archivo .docx del storage
    await bucket.file(object.name).delete();

    // Limpiar archivos temporales
    await fs.unlink(tempFilePath);
    await fs.unlink(tempOutputPath);

    return null;
});
