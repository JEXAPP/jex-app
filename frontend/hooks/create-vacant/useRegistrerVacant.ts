import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import useBackendConection from '@/services/useBackendConection';
import axios from 'axios';

// Tipos
type Turno = {
  fechaInicio: Date | null;
  horaInicio: string;
  fechaFin: Date | null;
  horaFin: string;
  pago: string;
  cantidad: string;
};

type Vacante = {
  rol: string;
  otrosRol: string;
  rolNombre: string;
  descripcion: string;
  requerimientos: string[];
  turnos: Turno[];
};

export const useRegisterVacancyMulti = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const crearVacanteInicial = (): Vacante => ({
    rol: '',
    otrosRol: '',
    rolNombre: '',
    descripcion: '',
    requerimientos: [''],
    turnos: [
      {
        fechaInicio: null,
        horaInicio: '',
        fechaFin: null,
        horaFin: '',
        pago: '',
        cantidad: '',
      },
    ],
  });

  const [vacantes, setVacantes] = useState<Vacante[]>([crearVacanteInicial()]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [rolesDisponibles, setRolesDisponibles] = useState<
  { label: string; value: number }[]
>([]);
 


  useEffect(() => {
    axios
      .get('https://jex-app-5ii7.onrender.com/api/vacancies/job-types/')
      .then((response) => {
        const opciones = response.data.map((rol) => ({
          label: rol.name,
          value: rol.id,
        }));
        console.log('Roles disponibles:', opciones)
        setRolesDisponibles(opciones);
      })
      .catch((error) => {
        console.error('Error al obtener roles:', error);
      })
    }, []);

  const agregarVacante = () => {
    setVacantes((prev) => [...prev, crearVacanteInicial()]);
  };
  
  const opcionesDropdown = rolesDisponibles.map((rol) => ({
      label: rol.label,
      value: rol.value.toString(),
    }));

  const actualizarRol = (index: number, id: string, nombre: string) => {
    setVacantes((prev) => {
      const copia = [...prev];
      copia[index] = {
        ...copia[index],
        rol: id,
        rolNombre: nombre,
      };
      return copia;
    });
  };

  const eliminarVacante = (index: number) => {
  const nuevasVacantes = [...vacantes];
  nuevasVacantes.splice(index, 1);
  setVacantes(nuevasVacantes);
};

  const actualizarCampo = (
  index: number,
  campo: 'rol' | 'otrosRol' | 'rolNombre'  |'descripcion',
  valor: string
) => {
  const copia = [...vacantes];
  copia[index] = {
    ...copia[index],
    [campo]: valor,
  };
  setVacantes(copia);
};

  const actualizarRequerimiento = (
    indexVacante: number,
    indexReq: number,
    texto: string
  ) => {
    const copia = [...vacantes];
    copia[indexVacante].requerimientos[indexReq] = texto;
    setVacantes(copia);
  };

  const agregarRequerimiento = (indexVacante: number) => {
    const copia = [...vacantes];
    copia[indexVacante].requerimientos.push('');
    setVacantes(copia);
  };

  const eliminarRequerimiento = (indexVacante: number, indexReq: number) => {
    const copia = [...vacantes];
    copia[indexVacante].requerimientos.splice(indexReq, 1);
    setVacantes(copia);
  };

  const agregarTurno = (indexVacante: number) => {
    const copia = [...vacantes];
    copia[indexVacante].turnos.push({
      fechaInicio: null,
      horaInicio: '',
      fechaFin: null,
      horaFin: '',
      pago: '',
      cantidad: '',
    });
    setVacantes(copia);
  };

  const eliminarTurno = (indexVacante: number, indexTurno: number) => {
    const copia = [...vacantes];
    copia[indexVacante].turnos.splice(indexTurno, 1);
    setVacantes(copia);
  };

  const actualizarTurno = (
    indexVacante: number,
    indexTurno: number,
    campo: keyof Turno,
    valor: string | Date | null
  ) => {
    const copia = [...vacantes];
    const turno = copia[indexVacante].turnos[indexTurno];

    if (campo === 'cantidad' && typeof valor === 'string') {
      const soloNumeros = valor.replace(/\D/g, '');
      let num = soloNumeros === '' ? NaN : parseInt(soloNumeros, 10);
      if (isNaN(num)) {
        turno.cantidad = '';
      } else {
        if (num < 1) num = 1;
        if (num > 50) num = 50;
        turno.cantidad = num.toString();
      }
    } else if (campo === 'pago' && typeof valor === 'string') {
      const soloNumeros = valor.replace(/\D/g, '');
      const numero = soloNumeros === '' ? NaN : parseInt(soloNumeros, 10);
      turno.pago = isNaN(numero) ? '' : numero.toLocaleString('es-AR');
    } else {
      // Asigna directamente si es string o Date
      (turno[campo] as typeof valor) = valor;
    }

    setVacantes(copia);
  };

  const formatearFecha = (fecha: Date): string => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();



    return `${dia}/${mes}/${anio}`;
  };



  const limpiarYFormatearPago = (pago: string): string => {
  const soloNumeros = pago.replace(/\./g, ''); // elimina puntos de miles
  const numero = parseInt(soloNumeros, 10);
  if (isNaN(numero)) return '0.00';
  return `${numero.toFixed(2)}`; // agrega ".00"
};

  const handleRegistrarTodas = async () => {
    try {
      const payload = vacantes.map((v) => {
  const base = {
    job_type: v.rol,
    description: v.descripcion,
    requirements: v.requerimientos
      .filter((req) => req.trim() !== '') // opcional: evita mandar vacíos
      .map((req) => ({ description: req })),
    shifts: v.turnos.map((t) => ({
      start_date: formatearFecha(t.fechaInicio!),
      start_time: t.horaInicio,
      end_date: formatearFecha(t.fechaFin!),
      end_time: t.horaFin,
      payment: limpiarYFormatearPago(t.pago),
      quantity: t.cantidad,
    })),
    event: 1,
  };

  // Si el rol es "Otro", agregamos el campo otrosRol
  if (v.rolNombre === 'Otro') {
    return {
      ...base,
      specific_job_type: v.otrosRol,
    };
  }

  return base;
});
      console.log( payload);

      for (const vacante of payload) {
        await requestBackend('/api/vacantes/register', vacante, 'POST');
      }

      setShowSuccess(true);
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message || 'Error al registrar las vacantes';
      setErrorMessage(mensaje);
      setShowError(true);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    vacantes,
    agregarVacante,
    actualizarCampo,
    actualizarRequerimiento,
    agregarRequerimiento,
    eliminarRequerimiento,
    agregarTurno,
    eliminarTurno,
    actualizarTurno,
    handleRegistrarTodas,
    showSuccess,
    showError,
    errorMessage,
    closeError,
    opcionesDropdown,
    actualizarRol,
    closeSuccess,
    eliminarVacante
  };
};