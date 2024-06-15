import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import { BsSearch, BsFillCalendarCheckFill } from 'react-icons/bs';
import ValidationMaintenance from "../validations/ValidationMaintenance";
import Swal from 'sweetalert2'
import { useAuth } from "../context/authContext";

const MntFormProduct = ({ onSubmitFn }) => {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    getValues
  } = useForm();

  const codigoValue = getValues('codigo');
  const fechaValue = getValues('fecha')
  const { user, logout } = useAuth();

  let handleSwal = null
  if (codigoValue && fechaValue) {
    handleSwal = () => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha programado el mantenimiento',
        showConfirmButton: false,
        timer: 2000
      })
    }



  }
  return (
    <form onSubmit={handleSubmit(onSubmitFn)} className='max-w-[400px]-w-full h-full py-16 bg-gray-50 px-8 rounded-lg m-4'>
      <div>

        <label className="block text-gray-900 font-semibold mb-2 text-lg">Digite el código del activo:</label>
        <div className="flex items-center mb-12" >
          <BsSearch className='w-7 h-8 mr-3 sm:mb-5 text-gray-900' />
          <Input
            errors={errors}
            validation={ValidationMaintenance}
            register={register}
            nameRegister="codigo"
            className="w-full rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
            placeholder="0000000"
            typeInput="text"
          />
        </div>
        <label className="block text-gray-800 font-semibold mb-2 text-lg">Seleccione el mes de mantenimiento del activo:</label>

        <div className='flex items-center'>
          <BsFillCalendarCheckFill className='w-7 h-8 mr-3 text-gray-900' />



          <select
            style={{ fontSize: '16px', verticalAlign: 'middle', margin: '0' }}
            className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-10"
            {...register('fecha', { required: 'La fecha es requerida' })}

          //validation={ValidationMaintenance} //No funciona porque Select no es CustomCom
          >
            <option value="">Elige un mes</option>
            <option value="Enero">Enero</option>
            <option value="Febrero">Febrero</option>
            <option value="Marzo">Marzo</option>
            <option value="Abril">Abril</option>
            <option value="Mayo">Mayo</option>
            <option value="Junio">Junio</option>
            <option value="Julio">Julio</option>
            <option value="Agosto">Agosto</option>
            <option value="Septiembre">Septiembre</option>
            <option value="Octubre">Octubre</option>
            <option value="Noviembre">Noviembre</option>
            <option value="Diciembre">Diciembre</option>
          </select>
        </div>
        <div>
          {errors.fecha && (



          <select
            style={{ fontSize: '16px', verticalAlign: 'middle', margin: '0' }}
            className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-10"
            {...register('fecha', { required: 'La fecha es requerida' })}


          //validation={ValidationMaintenance} //No funciona porque Select no es CustomCom
          >
            <option value="">Elige un mes</option>
            <option value="Enero">Enero</option>
            <option value="Febrero">Febrero</option>
            <option value="Marzo">Marzo</option>
            <option value="Abril">Abril</option>
            <option value="Mayo">Mayo</option>
            <option value="Junio">Junio</option>
            <option value="Julio">Julio</option>
            <option value="Agosto">Agosto</option>
            <option value="Septiembre">Septiembre</option>
            <option value="Octubre">Octubre</option>
            <option value="Noviembre">Noviembre</option>
            <option value="Diciembre">Diciembre</option>
          </select>)}
        </div>
        <div>
          {errors.fecha && (
            <span className="flex items-center font-medium text-red-500 ml-10 mt-2 ">

              {errors.fecha.message}
            </span>
          )}
        </div>


        {user.role !== 'user2' && (
        <button
          type="submit"
          onClick={handleSwal}
          className="w-3/4 my-5 py-2 mx-16 bg-gray-900 shadow-lg shadow-gray text-lg hover:shadow-gray-900/60 duration-150 text-white font-bold rounded-lg"
        >
          Programar mantenimiento
        </button>
        )}

      </div>
    </form>
  )

}

export default MntFormProduct