import React from 'react'
import { Worker } from '@react-pdf-viewer/core'
// Import the main component
import { Viewer } from '@react-pdf-viewer/core'

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css'

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export const Modal = ({ setModal, resume }) => {

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (

    <div  className="z-10" style={{ width: '100%', height: '100vh', position: 'fixed', top: '0', left: '0', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <div style={{ width: '900px', height: '600px', backgroundColor: '#fff', position: 'relative' }}>

        <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: 'red', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: '600', cursor: 'pointer', position: 'absolute', top: '-15px', right: '-15px', fontFamily: 'Raleway'}}

          onClick={() => setModal(false)}>
          x
        </div>

        {resume != null && (

          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">

            <Viewer fileUrl={resume} plugins={[defaultLayoutPluginInstance]}/>;

          </Worker>
        )}


      </div>

    </div >
  )
}

export default Modal;
