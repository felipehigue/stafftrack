'use client'
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaTachometerAlt, FaUsers, FaUserTag, FaCalendarAlt, FaCalendarTimes, FaTasks, FaEye, FaPlus } from 'react-icons/fa'; // Importa FaPlus
import Sidebar from '../components/Sidebar';

export default function Tareas() {
  const [showForm, setShowForm] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');
  const [prioridad, setPrioridad] = useState('MEDIA');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');

  const [tareas, setTareas] = useState([]);
  const [tareaDetalle, setTareaDetalle] = useState(null);

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/empleados');
        const data = await res.json();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      }
    };

    const obtenerDepartamentos = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/departamentos');
        const data = await res.json();
        setDepartamentos(data);
      } catch (error) {
        console.error('Error al cargar departamentos:', error);
      }
    };

    const obtenerTareas = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/tareas');
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };

    obtenerEmpleados();
    obtenerDepartamentos();
    obtenerTareas();
  }, []);

  const crearTarea = async (tareaData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tareas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: tareaData.titulo,
          descripcion: tareaData.descripcion,
          empleado_id: tareaData.empleadoId,
          departamento_id: tareaData.departamentoId,
          estado: tareaData.estado,
          prioridad: tareaData.prioridad,
          fecha_vencimiento: fechaVencimiento + 'T00:00:00',
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error('Error detallado:', errorData);
        } else {
          const errorText = await response.text();
          console.error('Error no JSON:', errorText);
        }
        throw new Error('Error al crear tarea');
      }

      if (contentType && contentType.includes("application/json")) {
        const nuevaTarea = await response.json();
        console.log('Tarea creada:', nuevaTarea);

        setTareas((prev) => [...prev, nuevaTarea]);
        setShowForm(false);
        limpiarFormulario();
      } else {
        console.error('Respuesta no es JSON:', await response.text());
        throw new Error('La respuesta del servidor no es JSON');
      }
    } catch (err) {
      console.error('Error completo:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setEmpleadoSeleccionado('');
    setDepartamentoSeleccionado('');
    setEstado('PENDIENTE');
    setPrioridad('MEDIA');
    setFechaVencimiento('');
  };

  return (
    <>
      <Head>
        <title>StaffTrack - Asignación de Tareas</title>
      </Head>
      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />

        <main className="ml-64 flex-1 p-8 bg-white min-h-screen">
          <header className="flex justify-between items-center mb-8 border-b pb-5">
            <h1 className="text-2xl font-semibold">Asignación de Tareas</h1>
            <div className="flex items-center">
              <span>Bienvenido, Admin</span>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center ml-4 cursor-pointer">
                <FaUser />
              </div>
            </div>
          </header>

          <div className="flex flex-col md:flex-row justify-between mb-5 gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar tareas..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded text-sm">
                <option>Todas las áreas</option>
                <option>Recursos Humanos</option>
                <option>Tecnología</option>
                <option>Operaciones</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded text-sm">
                <option>Todos los estados</option>
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <button
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setShowForm(true)}
            >
              <FaPlus className="inline-block mr-2" />
              Agregar Tarea
            </button>
          </div>

          <table className="w-full table-auto border-collapse mb-5">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 font-semibold">Tarea</th>
                <th className="text-left py-3 px-4 font-semibold">Asignado a</th>
                <th className="text-left py-3 px-4 font-semibold">Área</th>
                <th className="text-left py-3 px-4 font-semibold">Fecha Límite</th>
                <th className="text-left py-3 px-4 font-semibold">Estado</th>
                <th className="text-left py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id} className="hover:bg-gray-100 border-b">
                  <td className="py-3 px-4">{tarea.titulo}</td>
                  <td className="py-3 px-4">{tarea.empleado ? tarea.empleado.nombre : 'Sin asignar'}</td>
                  <td className="py-3 px-4">{tarea.departamento ? tarea.departamento.nombre : 'Sin departamento'}</td>
                  <td className="py-3 px-4">{tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded 
                                      ${tarea.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-900' : ''}
                                      ${tarea.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-900' : ''}
                                      ${tarea.estado === 'COMPLETADA' ? 'bg-green-100 text-green-900' : ''}`}>
                      {tarea.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={() => setTareaDetalle(tarea)}
                    >
                      <FaEye />
                    </button>
                    {/* Aquí podrías agregar el botón de editar si lo necesitas */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showForm && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h2 className="text-lg font-semibold">Asignar Tarea</h2>
                  <button className="text-gray-500 text-xl" onClick={() => setShowForm(false)}>×</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Nombre de la tarea</label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Asignado a</label>
                    <select
                      id="empleado"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={empleadoSeleccionado}
                      onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                    >
                      <option value="">Selecciona un empleado</option>
                      {empleados.map((empleado) => (
                        <option key={empleado.id} value={empleado.id}>
                          {empleado.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Área</label>
                    <select
                      id="departamento"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={departamentoSeleccionado}
                      onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                    >
                      <option value="">Selecciona un departamento</option>
                      {departamentos.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Estado</label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EN_PROGRESO">En progreso</option>
                      <option value="COMPLETADA">Completada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Prioridad</label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={prioridad}
                      onChange={(e) => setPrioridad(e.target.value)}
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Fecha de Vencimiento</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={fechaVencimiento}
                      onChange={(e) => setFechaVencimiento(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Descripción</label>
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)} />
                  </div>
                  <div className="flex justify-end gap-2 pt-3">
                    <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancelar</button>
                    <button
                      onClick={() =>
                        crearTarea({
                          titulo,
                          descripcion,
                          empleadoId: empleadoSeleccionado,
                          estado,
                          prioridad,
                          fechaVencimiento
                        })
                      }
                      className="px-4 py-2 bg-black text-white rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tareaDetalle && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h2 className="text-lg font-semibold">Detalles de la Tarea</h2>
                  <button className="text-gray-500 text-xl" onClick={() => setTareaDetalle(null)}>×</button>
                </div>
                <div>
                  <p><strong>Título:</strong> {tareaDetalle.titulo}</p>
                  <p><strong>Descripción:</strong> {tareaDetalle.descripcion}</p>
                  <p><strong>Asignado a:</strong> {tareaDetalle.empleado ? tareaDetalle.empleado.nombre : 'Sin asignar'}</p>
                  <p><strong>Área:</strong> {tareaDetalle.departamento ? tareaDetalle.departamento.nombre : 'Sin departamento'}</p>
                  <p><strong>Estado:</strong> {tareaDetalle.estado}</p>
                  <p><strong>Prioridad:</strong> {tareaDetalle.prioridad}</p>
                  <p><strong>Fecha de Vencimiento:</strong> {tareaDetalle.fecha_vencimiento ? new Date(tareaDetalle.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}</p>
                  {/* Puedes agregar más detalles aquí */}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}