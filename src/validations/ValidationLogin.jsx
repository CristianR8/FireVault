const validationLogin = {
    email: {
      validate: {
        required: true,
        pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      },
      messages: {
        required: 'El email es requerido',
        pattern: 'El email no es válido',
        usernotfound: 'Usuario no encontrado'
      }
    },
    password: {
      validate: {
        required: true,
        minLength: 3
      },
      messages: {
        passwordwrong: 'Contraseña incorrecta',
        required: 'La contraseña es requerida',
        minLength: 'La contraseña debe tener al menos 3 caracteres'
      }
    },
    remember: {
      validate: {
        required: false
      },
      messages: {
      }
    }
  }
  
  export default validationLogin
  