import { useState } from 'react';
import { useRouter } from 'expo-router';

export const useRegistroEmpleado = () => {
  const router = useRouter();

  // Estados de los campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para manejo de errores y confirmación
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Valida que todos los campos estén completos y que las contraseñas coincidan.

  const validarCampos = () => {
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowError(true);
      return false;
    }

    return true;
  };

  // Maneja el evento de registro al presionar el botón.
  const handleRegistrarEmpleado = () => {
    if (!validarCampos()) return;

    // Acá podés enviar los datos al backend o guardarlos temporalmente
    setShowSuccess(true);
  };

  // Cierra el modales
  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    nombre,
    apellido,
    email,
    password,
    confirmPassword,
    setNombre,
    setApellido,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleRegistrarEmpleado,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  };
};
