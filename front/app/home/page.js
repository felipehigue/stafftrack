'use client'
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { FaTasks, FaClock, FaTachometerAlt, FaUsers, FaUserTag } from 'react-icons/fa'; // Importa los iconos de los cuadros

export default function Dashboard() {
  const [tareas, setTareas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [errorTareas, setErrorTareas] = useState(null);
  const [errorTurnos, setErrorTurnos] = useState(null);
  const [loadingTareas, setLoadingTareas] = useState(true);
  const [loadingTurnos, setLoadingTurnos] = useState(true);

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/tareas/'); 
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTareas(data);
        setLoadingTareas(false);
      } catch (error) {
        setErrorTareas(error.message);
        setLoadingTareas(false);
      }
    };

    const cargarTurnos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/turnos/'); 
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTurnos(data);
        setLoadingTurnos(false);
      } catch (error) {
        setErrorTurnos(error.message);
        setLoadingTurnos(false);
      }
    };

    cargarTareas();
    cargarTurnos();
  }, []);

  return (
    <>
      <Head>
        <title>StaffTrack - Dashboard</title>
      </Head>
      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 bg-white min-h-screen">
          <header className="flex justify-between items-center mb-8 border-b pb-5">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="flex items-center">
              <span>Bienvenido, Admin</span>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center ml-4 cursor-pointer">
                {/* <FaUser /> */}
              </div>
            </div>
          </header>

          {/* Cuadros Informativos Estáticos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-500">15</div>
                <div className="text-gray-600">Tareas Pendientes</div>
              </div>
              <FaTachometerAlt className="text-4xl text-blue-300" />
            </div>
            <div className="bg-white shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-500">8</div>
                <div className="text-gray-600">En Progreso</div>
              </div>
              <FaTasks className="text-4xl text-yellow-300" />
            </div>
            <div className="bg-white shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-500">22</div>
                <div className="text-gray-600">Completadas</div>
              </div>
              <FaUsers className="text-4xl text-green-300" />
            </div>
            <div className="bg-white shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500">45</div>
                <div className="text-gray-600">Empleados Activos</div>
              </div>
              <FaUserTag className="text-4xl text-purple-300" />
            </div>
          </div>

          {/* Sección de Tareas Dinámicas */}
          <div className="bg-white shadow rounded-md p-4 mb-6">
            <div className="flex items-center mb-4">
              <FaTasks className="text-xl mr-2 text-blue-500" />
              <h2 className="text-lg font-semibold">Tareas Asignadas Recientes</h2>
            </div>
            {loadingTareas && <p>Cargando tareas...</p>}
            {errorTareas && <p className="text-red-500">Error al cargar tareas: {errorTareas}</p>}
            {!loadingTareas && !errorTareas && tareas.length === 0 && <p>No hay tareas asignadas.</p>}
            {!loadingTareas && !errorTareas && tareas.length > 0 && (
              <ul>
                {tareas.map((tarea) => (
                  <li key={tarea.id} className="py-2 border-b last:border-b-0">
                    <strong className="block">{tarea.titulo}</strong>
                    <span className="text-sm text-gray-600">Asignado a: {tarea.empleado ? tarea.empleado.nombre : 'Sin asignar'}</span>
                    {tarea.fecha_vencimiento && (
                      <span className="text-sm text-gray-600 ml-2">Vence: {new Date(tarea.fecha_vencimiento).toLocaleDateString()}</span>
                    )}
                    <span className={`inline-block ml-2 px-2 py-1 text-xs font-medium rounded ${tarea.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-900' : tarea.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'}`}>{tarea.estado}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sección de Turnos Dinámicos */}
          <div className="bg-white shadow rounded-md p-4">
            <div className="flex items-center mb-4">
              <FaClock className="text-xl mr-2 text-green-500" />
              <h2 className="text-lg font-semibold">Turnos de Hoy</h2>
            </div>
            {loadingTurnos && <p>Cargando turnos...</p>}
            {errorTurnos && <p className="text-red-500">Error al cargar turnos: {errorTurnos}</p>}
            {!loadingTurnos && !errorTurnos && turnos.length === 0 && <p>No hay turnos programados para hoy.</p>}
            {!loadingTurnos && !errorTurnos && turnos.length > 0 && (
              <ul>
                {turnos.map((turno) => (
                  <li key={turno.id} className="py-2 border-b last:border-b-0">
                    <strong className="block">Empleado: {turno.empleado ? turno.empleado.nombre : 'Sin asignar'}</strong>
                    <span className="text-sm text-gray-600">Inicio: {new Date(turno.hora_inicio).toLocaleTimeString()}</span>
                    <span className="text-sm text-gray-600 ml-2">Fin: {new Date(turno.hora_fin).toLocaleTimeString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}