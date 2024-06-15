const ValidationResetPwd = {
    email: {
        validate: {
          required: true,
          pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
        messages: {
          required: 'El correo es requerido',
          pattern: 'El correo no es válido',
          emailnotfound: 'Correo no encontrado'
        }
      }
}

export default ValidationResetPwd