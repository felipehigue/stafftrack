'use client'
import { useState, useEffect } from 'react';
import { FaTachometerAlt, FaUsers, FaUserTag, FaCalendarAlt, FaCalendarTimes, FaTasks, FaSearch, FaUser, FaPlus, FaDownload, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';

export default function Gestionpersonal() {
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState({
    nombre: '',
    apellido: '',
    email: '',
    codigo_empleado: '',
    cargo: null,
    estado: 'ACTIVO',
    fecha_ingreso: '',
    telefono: ''
  });
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cargo_id: '',
    departamento_id: '',
    fecha_ingreso: '',
    estado: 'ACTIVO',
    telefono: ''
  });

  // Fetch data from API
  useEffect(() => {
    fetchEmpleados();
    fetchDepartamentos();
    fetchCargos();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/empleados/');
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error fetching empleados:', error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/departamentos/');
      
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cargos/');
      const data = await response.json();
      setCargos(data);
    } catch (error) {
      console.error('Error fetching cargos:', error);
    }
  };

  const handleCreateEmpleado = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/empleados/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          cargo_id: '',
          departamento_id: '',
          fecha_ingreso: '',
          estado: 'ACTIVO',
          telefono: ''
        });
        fetchEmpleados();
      }
    } catch (error) {
      console.error('Error creating empleado:', error);
    }
  };

  const handleDeleteEmpleado = async (id) => {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/empleados/${id}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchEmpleados();
        }
      } catch (error) {
        console.error('Error deleting empleado:', error);
      }
    }
  };

  const handleShowDetail = (empleado) => {
    setSelectedEmpleado({
      ...empleado,
      cargo: empleado.cargo || { nombre: 'No asignado', departamento: { nombre: 'No asignado' } }
    });
    setShowDetail(true);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/empleados/exportar/');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'empleados.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error exporting empleados:', error);
    }
  };

  const filteredEmpleados = empleados.filter(empleado => {
    const searchLower = searchTerm.toLowerCase();
    return (
      empleado.nombre?.toLowerCase().includes(searchLower) ||
      empleado.apellido?.toLowerCase().includes(searchLower) ||
      empleado.email?.toLowerCase().includes(searchLower) ||
      empleado.codigo_empleado?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8 bg-white min-h-screen">
        <header className="flex justify-between items-center border-b pb-5 mb-8">
          <h1 className="text-2xl font-semibold">Gestión de Personal</h1>
          <div className="flex items-center">
            <span>Bienvenido, Admin</span>
            <div className="ml-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
              <FaUser />
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar empleados..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              <FaPlus /> Nuevo Empleado
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200">
              <FaDownload /> Exportar
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Cargo</th>
                <th className="text-left px-4 py-3">Área</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Fecha Ingreso</th>
                <th className="text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpleados.map((empleado) => (
                <tr key={empleado.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUser />
                      </div>
                      <div>
                        <div className="font-medium">{empleado.nombre} {empleado.apellido}</div>
                        <div className="text-xs text-gray-500">{empleado.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{empleado.codigo_empleado}</td>
                  <td className="px-4 py-3">{empleado.cargo?.nombre || 'No asignado'}</td>
                  <td className="px-4 py-3">
  {(() => {
    if (empleado.cargo) {
      const departamento = departamentos.find(d => d.id === empleado.cargo.departamento);
      return departamento ? departamento.nombre : 'No asignado';
    }
    return 'No asignado';
  })()}
</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      empleado.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                      empleado.estado === 'INACTIVO' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {empleado.estado === 'ACTIVO' ? 'Activo' :
                       empleado.estado === 'INACTIVO' ? 'Inactivo' : 'En Licencia'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{empleado.fecha_ingreso ? new Date(empleado.fecha_ingreso).toLocaleDateString() : 'No especificada'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button 
                      onClick={() => handleShowDetail(empleado)}
                      className="px-2 py-1 border rounded hover:bg-gray-100">
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleDeleteEmpleado(empleado.id)}
                      className="px-2 py-1 border rounded text-red-600 hover:bg-red-50">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">Agregar Empleado</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
              </div>
              <form onSubmit={handleCreateEmpleado} className="space-y-4">
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Nombre</label>
                    <input 
                      className="w-full border border-gray-300 px-3 py-2 rounded" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Apellido</label>
                    <input 
                      className="w-full border border-gray-300 px-3 py-2 rounded" 
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Correo</label>
                    <input 
                      type="email"
                      className="w-full border border-gray-300 px-3 py-2 rounded" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Teléfono</label>
                    <input 
                      className="w-full border border-gray-300 px-3 py-2 rounded" 
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Área</label>
                    <select
  className="w-full border border-gray-300 px-3 py-2 rounded"
  value={formData.departamento_id}
  onChange={(e) => {
    setFormData({
      ...formData,
      departamento_id: e.target.value
    });
  }}
>
  <option value="">Seleccione un departamento</option>
  {departamentos.map((dep) => (
    <option key={dep.id} value={dep.id}>
      {dep.nombre}
    </option>
  ))}
</select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Cargo*</label>
                    <select
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                      value={formData.cargo_id}
                      onChange={(e) => setFormData({...formData, cargo_id: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar cargo</option>
                      {cargos.map((cargo) => {
                        // Find the matching department object using the departamento ID
                        const departamento = departamentos.find(d => d.id === cargo.departamento);
                        return (
                          <option key={cargo.id} value={cargo.id}>
                            {cargo.nombre} {departamento ? `(${departamento.nombre})` : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Estado</label>
                    <select
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                      <option value="LICENCIA">En Licencia</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Fecha Ingreso*</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 px-3 py-2 rounded" 
                      value={formData.fecha_ingreso}
                      onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)} 
                    className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detalles */}
        {showDetail && selectedEmpleado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-lg w-full relative">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold">Detalles del Empleado</h2>
                <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <FaUser className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEmpleado.nombre} {selectedEmpleado.apellido}</h3>
                    <p className="text-gray-600">{selectedEmpleado.codigo_empleado}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-500">Información Personal</h4>
                    <p>Email: {selectedEmpleado.email || 'No especificado'}</p>
                    <p>Teléfono: {selectedEmpleado.telefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Información Laboral</h4>
                    <p>Cargo: {selectedEmpleado.cargo?.nombre || 'No asignado'}</p>
                    <p>Área: {
  (() => {
    if (selectedEmpleado.cargo?.departamento) {
      const departamento = departamentos.find(d => d.id === selectedEmpleado.cargo.departamento);
      return departamento ? departamento.nombre : 'No asignado';
    }
    return 'No asignado';
  })()
}</p>
                    <p>Estado: 
                      <span className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedEmpleado.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                        selectedEmpleado.estado === 'INACTIVO' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedEmpleado.estado === 'ACTIVO' ? 'Activo' :
                         selectedEmpleado.estado === 'INACTIVO' ? 'Inactivo' : 'En Licencia'}
                      </span>
                    </p>
                    <p>Fecha Ingreso: {selectedEmpleado.fecha_ingreso ? new Date(selectedEmpleado.fecha_ingreso).toLocaleDateString() : 'No especificada'}</p>
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setShowDetail(false)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}