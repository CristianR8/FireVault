import React, { useEffect, useState } from "react";
import Input from "./Input";

import { useAuth } from "../context/authContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";


import ValidationResetPwd from "../validations/ValidationResetPwd";

import { Button, Modal } from 'flowbite-react';
import Swal from 'sweetalert2';


export default function ResetPasswordForm() {

  const [openModal, setOpenModal] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmitFunction = async (user) => {
    try {
      await resetPassword(user.email);
      setOpenModal(true);

      //setError('We sent you an email. Check your inbox')
    } catch (error) {
      setError("email", { type: "emailnotfound" }, { shouldFocus: true });
    }
  }

  let handleSwalReset = null;
  if (openModal) {
    handleSwalReset = () => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Te hemos enviado un correo para recuperar tu contraseña',
        showConfirmButton: true,
        timer: 3000
      }).then(() => {
        navigate('/auth');
      });
    };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen px-5 py-5">
      <div className="hidden sm:block">
        <img
          className="w-full h-full rounded-l-lg object-cover shadow-[0_3px_10px_rgb(0,0,0,0.5)]"
          src="/assets/lineas1.jpg"
          alt="Login"
        />
      </div>
      <div className="bg-fray-800 flex flex-col bg-stone-200 relative justify-center rounded-r-lg shadow-[0_3px_10px_rgb(0,0,0,0.5)]">
        <form
          onSubmit={handleSubmit(onSubmitFunction)}
          className="max-w-[400px]-w-full mx-20 bg-gray-900 p-10 px-8 rounded-lg"
        >
          <h2 className="text-4xl text-white font-bold text-center">
            RECUPERAR CONTRASEÑA
          </h2>
          <div className="flex flex-col text-gray-400 py-2">
            <label>Correo electrónico</label>
            <Input
              errors={errors}
              validation={ValidationResetPwd}
              register={register}
              nameRegister="email"
              placeholder="tucorreo@gmail.com"
              className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-bñlue-500 focus:bg-gray-800 focus:outline-none"
              type="text"
            />
          </div>



          <button onClick={handleSwalReset} className="w-full my-5 py-2 duration-200 bg-stone-400 shadow-lg shadow-teal hover:shadow-teal-50/30 text-gray-800 font-bold rounded-lg">
            RECUPERAR
          </button>
        </form>

      </div>
    </div>
  );

}