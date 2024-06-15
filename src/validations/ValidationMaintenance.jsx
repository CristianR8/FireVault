const ValidationMaintenance = {
    codigo: {
        validate: {
          required: true,
        },
        messages: {
          required: 'El codigo es requerido'
        }
      },

    fecha: {
        validate: {
          required: true,
        },
        messages: {
          required: 'La fecha es requeridaa',
        }
    }
}

export default ValidationMaintenance