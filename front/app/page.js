"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',    // Cambiado de username a email
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Obtener token CSRF
      const csrfResponse = await fetch('http://127.0.0.1:8000/api/csrf/', {
        credentials: 'include'
      });
      
      if (!csrfResponse.ok) {
        throw new Error('Error de seguridad del sistema');
      }
      const { csrfToken } = await csrfResponse.json();

      // 2. Hacer login con email
      const loginResponse = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
          email: formData.email.trim(),  // Usamos email en lugar de username
          password: formData.password
        }),
        credentials: 'include'
      });

      const responseData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(responseData.error || 'Error de autenticación');
      }

      router.push('/home');
      
    } catch (err) {
      setError(err.message);
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen w-screen flex">
      {/* Sección izquierda */}
      <div className="w-1/2 bg-gradient-to-br from-black to-gray-800 flex items-center justify-center flex-col text-white p-10">
        <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center text-4xl border-2 border-white">
          <span>ST</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mt-5 text-center">StaffTrack</h1>
        <p className="text-center leading-relaxed text-gray-300 mt-3">
          Solución completa para la gestión de personal
        </p>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-1/2 bg-white p-12 md:p-16 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese su correo electrónico"
              required
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black bg-gray-100"
            />
          </div>

          <div className="text-right mb-8">
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
              ¿Olvidó su contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-black font-semibold cursor-pointer hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}