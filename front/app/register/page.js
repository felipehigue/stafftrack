"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setPasswordError('');
    setFormErrors({});
    setIsSubmitting(true);

    const formData = {
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      email: event.target.email.value,
      position: event.target.position.value,
      department: event.target.department.value,
      password1: event.target.password.value,
      password2: event.target['confirm-password'].value,
      username: event.target.email.value.split('@')[0]
    };

    // Validación de contraseña
    if (formData.password1 !== formData.password2) {
      setPasswordError('Las contraseñas no coinciden.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        if (responseData.errors) {
          setFormErrors(responseData.errors);
        }
        setIsSubmitting(false);
        return;
      }

      // Redirección después de registro exitoso
      router.push('/');
      
    } catch (error) {
      console.error('Error de conexión:', error);
      setFormErrors({ general: ['Error al conectar con el servidor'] });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white h-screen w-screen flex">
      <div className="w-1/2 bg-gradient-to-br from-black to-gray-800 flex items-center justify-center flex-col text-white p-10">
        <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center text-4xl border-2 border-white">
          <span>ST</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mt-5 text-center">StaffTrack</h1>
        <p className="text-center leading-relaxed text-gray-300 mt-3">
          Registre su cuenta para comenzar a gestionar su equipo de trabajo.
        </p>
      </div>

      <div className="w-1/2 bg-white p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear Cuenta</h2>
        
        {/* Mostrar errores generales */}
        {formErrors.general && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {formErrors.general.join(', ')}
          </div>
        )}

        {/* Mostrar error de contraseña */}
        {passwordError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="md:flex md:gap-4 mb-4">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Ingrese su nombre"
                required
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100 ${
                  formErrors.firstname ? 'border-red-500' : ''
                }`}
              />
              {formErrors.firstname && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.firstname.join(', ')}</p>
              )}
            </div>
            <div className="md:w-1/2">
              <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">
                Apellido
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Ingrese su apellido"
                required
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100 ${
                  formErrors.lastname ? 'border-red-500' : ''
                }`}
              />
              {formErrors.lastname && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.lastname.join(', ')}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingrese su correo electrónico"
              required
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100 ${
                formErrors.email ? 'border-red-500' : ''
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs italic mt-1">{formErrors.email.join(', ')}</p>
            )}
          </div>

          <div className="md:flex md:gap-4 mb-4">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <label htmlFor="position" className="block text-gray-700 text-sm font-bold mb-2">
                Cargo
              </label>
              <input
                type="text"
                id="position"
                name="position"
                placeholder="Ej: Gerente, Analista"
                required
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100 ${
                  formErrors.position ? 'border-red-500' : ''
                }`}
              />
              {formErrors.position && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.position.join(', ')}</p>
              )}
            </div>
            <div className="md:w-1/2">
              <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">
                Área
              </label>
              <select
                id="department"
                name="department"
                defaultValue=""
                required
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100 ${
                  formErrors.department ? 'border-red-500' : ''
                }`}
              >
                <option value="" disabled>
                  Seleccione su área
                </option>
                <option value="rh">Recursos Humanos</option>
                <option value="it">Tecnología</option>
                <option value="finance">Finanzas</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operaciones</option>
                <option value="other">Otro</option>
              </select>
              {formErrors.department && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.department.join(', ')}</p>
              )}
            </div>
          </div>

          <div className="md:flex md:gap-4 mb-4">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Cree una contraseña"
                required
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100 ${
                  formErrors.password1 ? 'border-red-500' : ''
                }`}
              />
              {formErrors.password1 && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.password1.join(', ')}</p>
              )}
            </div>
            <div className="md:w-1/2">
              <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Repita su contraseña"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full mt-4 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          ¿Ya tiene una cuenta?{' '}
          <Link href="/" className="text-black hover:underline">
            Iniciar Sesión
          </Link>
        </p>

        <p className="text-center text-gray-600 text-sm mt-4">
          © 2025 StaffTrack. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}