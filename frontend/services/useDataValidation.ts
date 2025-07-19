export const useDataValidation = () => {
  // Validar formato de email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validar texto sin caracteres especiales
  const validateText = (texto: string): boolean => {
    const regex = /^[a-zA-ZÀ-ÿ0-9\s]*$/;
    return regex.test(texto);
  };

  // Validar contraseña con solo los caracteres especiales permitidos
  const validatePassword = (password: string): boolean => {
    const regex = /^[a-zA-Z0-9!»#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]*$/;
    return regex.test(password);
  };

  // Valida que el código de área esté dentro del rango permitido (11 a 3894)
  const validateCodeArea = (codigo: string): boolean => {
  const numero = parseInt(codigo, 10);
  return !isNaN(numero) && numero >= 11 && numero <= 3894;
  };

  // Verifica si el usuario tiene al menos 16 años
    const validateAge = (fecha: Date | null) => {
      if (!fecha) return false;
      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const mes = hoy.getMonth() - fecha.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }
      return edad >= 16;
    };

  return {
    validateEmail,
    validateText,
    validatePassword,
    validateCodeArea,
    validateAge
  };
};
