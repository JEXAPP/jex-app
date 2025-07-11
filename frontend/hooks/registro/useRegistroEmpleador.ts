import { useState } from 'react';
import { useRouter } from 'expo-router';

export const useRegistroEmpleador = () => {
  const router = useRouter();

  // Estados para los campos del formulario
  const [razonSocial, setRazonSocial] = useState('');
  const [cuit, setCuit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para control de errores y éxito
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Valida que todos los campos estén completos y que las contraseñas coincidan.
  const validarCampos = () => {
    if (!razonSocial || !cuit || !telefono || !email || !password || !confirmPassword) {
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
  const handleRegistrarEmpleador = () => {
    if (!validarCampos()) return;

    // Acá podrías enviar los datos al backend
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
    razonSocial,
    cuit,
    telefono,
    email,
    password,
    confirmPassword,
    setRazonSocial,
    setCuit,
    setTelefono,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleRegistrarEmpleador,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  };
};
