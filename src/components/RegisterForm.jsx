import React, { useState } from "react";
import Input from "./Input";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useAuth } from "../context/authContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import validationLogin from "../validations/ValidationLogin";

export default function RegisterForm() {
  const { signup } = useAuth();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm();

  const onSubmitFunction = async (data) => {
    try {
      await signup(data.email, data.password);
      navigate("/");
    } catch (error) {
      setError(error.message);
      if (error.code === "auth/email-already-in-use") {
        setFormError("email", { type: "emailInUse", message: "Email is already in use" }, { shouldFocus: true });
      }
      if (error.code === "auth/weak-password") {
        setFormError("password", { type: "weakPassword", message: "Password is too weak" }, { shouldFocus: true });
      }
    }
  };

  const toggle = () => {
    setVisible(!visible);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen px-5 py-5">
      <div className="hidden sm:block">
        <img
          className="w-full h-full rounded-l-lg object-cover shadow-[0_3px_10px_rgb(0,0,0,0.5)]"
          src="/assets/background2.png"
          alt="Login"
        />
      </div>
      <div className="flex flex-col bg-neutral-800 relative justify-center rounded-r-lg shadow-[0_3px_10px_rgb(0,0,0,0.5)]">
        <form
          onSubmit={handleSubmit(onSubmitFunction)}
          className="max-w-[400px]-w-full mx-20 bg-rose-600 p-10 px-8 rounded-lg"
        >
          <h2 className="text-4xl text-white font-bold text-center">
            REGISTRATE
          </h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col text-neutral-800 py-2">
            <label>Correo electrónico</label>
            <Input
              errors={errors}
              validation={validationLogin}
              register={register}
              nameRegister="email"
              placeholder="tucorreo@gmail.com"
              className="w-full rounded-lg bg-rose-50 mt-2 p-2 focus:border-rose-800 focus:bg-rose-100 focus:outline-none"
              type="text"
            />
          </div>
          <div className="flex flex-col text-neutral-800 relative py-2">
            <label>Contraseña</label>
            <Input
              errors={errors}
              validation={validationLogin}
              register={register}
              nameRegister="password"
              placeholder="***********"
              className="w-full rounded-lg bg-rose-50 mt-2 p-2 focus:border-rose-800 focus:bg-rose-100 focus:outline-none"
              typeInput={visible ? "text" : "password"}
            />
            <div className="text-2xl absolute my-11 right-2 text-gray-400">
              {visible ? (
                <AiOutlineEyeInvisible onClick={toggle} />
              ) : (
                <AiOutlineEye onClick={toggle} />
              )}
            </div>
          </div>

          <button className="w-full my-5 py-2 bg-neutral-800 shadow-lg shadow-teal hover:shadow-neutral-800/90 text-gray-50 font-bold rounded-lg">
            REGISTRARSE
          </button>
        </form>
      </div>
    </div>
  );
}
