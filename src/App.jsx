import React from "react";
import { Route, Routes } from "react-router-dom";

//import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from "./pages/Login";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Documentation from "./components/Documentation";
import Document from "./components/Document";

import AddProduct from "./components/AddProduct";
import EditRS from "./components/EditRS"
import EditHV from "./components/EditHV"


import RegisterForm from "./components/RegisterForm";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ModuleSelection from "./components/ModuleSelection";
import Maintenance from "./components/Maintenance";


function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/reset-pwd" element={<ResetPassword />} />
          <Route path="/document" element={<Document />} />
          <Route path="/module" element={
            <ProtectedRoute>
              <ModuleSelection />
            </ProtectedRoute>
          } />

          <Route path="/maintenance" element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          } />

          <Route path="/document" element={<Document />} />

          {["/documentation/hoja-de-vida",
            '/documentation/guia-de-manejo-rapido',
            '/documentation/ficha-tecnica',
            '/documentation/manual-de-usuario',
            '/documentation/hoja-de-vida-personal',
            '/documentation/protocolo-de-limpieza'].map((path, index) => {

              return (<Route key={index} path={path} element={
                <ProtectedRoute>
                  <Document />
                </ProtectedRoute>
              } />);
            })}


          <Route path="/module" element={
            <ProtectedRoute>
              <ModuleSelection />
            </ProtectedRoute>
          } />

          <Route path="/maintenance" element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />

          <Route path="/documentation" element={
            <ProtectedRoute>
              <Documentation />
            </ProtectedRoute>
          } />

          <Route path="/add-product" element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />

          <Route path="/edit-document" element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />

          <Route path="/edit-rs" element={
            <ProtectedRoute>
              <EditRS/>
            </ProtectedRoute>
          } />

          <Route path="/edit-hv" element={
            <ProtectedRoute>
              <EditHV />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>

    </>
  );
}

export default App;
