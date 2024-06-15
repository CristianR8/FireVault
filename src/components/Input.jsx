export default function Input({
  className,
  editStyle,
  label,
  typeInput,
  nameRegister,
  colSpan,
  register,
  errors,
  validation,
  placeholder,
  ...props // Agrega los props aquí
}) {
  const { validate, messages } = validation && validation[nameRegister]
    ? validation[nameRegister]
    : { validate: {}, messages: {} };

  // Obtén errorInput del objeto errors usando nameRegister como clave
  const errorInput = errors ? errors[nameRegister] : {};

  return (
    <div className={`block w-full mb-4 ${colSpan ? `col-span-${colSpan}` : ''} my-1`}>
      <label htmlFor={nameRegister} className={`font-medium md:text-lg ${errorInput ? 'text-red-500 block text-xl font-mono font-semibold' : 'block text-xl font-mono text-white font-semibold'}  `}>{label}</label>
      <input type={typeInput} id={nameRegister} placeholder={placeholder} className={`${className} ${errorInput ? 'border-red-500' : 'border-transparent focus:border-main-green-500 '} border border-gray-400 rounded-lg w-full `} {...register(nameRegister, validate)} {...props} />

     
      {
      errorInput && 
      <span className='flex items-center font-medium text-red-500 mt-1 ml-1'>
        {messages[errorInput.type]}
      </span>
      }
    </div>
  );
}

