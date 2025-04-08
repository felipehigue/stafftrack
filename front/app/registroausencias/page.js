'use client'
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function AbsenceRegistry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [absenceType, setAbsenceType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Datos de ejemplo
  const employees = [
    { id: 1, name: 'María González', avatar: 'MG', department: 'Ventas' },
    { id: 2, name: 'Carlos Mendoza', avatar: 'CM', department: 'Logística' },
    { id: 3, name: 'Ana Rodríguez', avatar: 'AR', department: 'Marketing' },
    { id: 4, name: 'Luis Pérez', avatar: 'LP', department: 'TI' },
    { id: 5, name: 'Sofía Ramírez', avatar: 'SR', department: 'RRHH' },
  ];

  const absences = [
    { id: 1, employeeId: 1, employeeName: 'María González', type: 'Enfermedad', startDate: '2023-05-10', endDate: '2023-05-12', status: 'Aprobado', notes: 'Gripe común' },
    { id: 2, employeeId: 2, employeeName: 'Carlos Mendoza', type: 'Vacaciones', startDate: '2023-05-15', endDate: '2023-05-20', status: 'Pendiente', notes: 'Viaje familiar' },
    { id: 3, employeeId: 3, employeeName: 'Ana Rodríguez', type: 'Personal', startDate: '2023-05-08', endDate: '2023-05-08', status: 'Aprobado', notes: 'Cita médica' },
    { id: 4, employeeId: 4, employeeName: 'Luis Pérez', type: 'Licencia', startDate: '2023-05-22', endDate: '2023-05-26', status: 'Rechazado', notes: 'Sin documentación' },
  ];

  const absenceTypes = ['Enfermedad', 'Vacaciones', 'Personal', 'Licencia', 'Duelo', 'Maternidad/Paternidad'];
  const statusOptions = ['Todos', 'Aprobado', 'Pendiente', 'Rechazado'];

  const handleNewAbsenceClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para registrar la ausencia
    console.log({
      employee: selectedEmployee.name,
      type: absenceType,
      startDate,
      endDate,
      notes
    });
    setIsModalOpen(false);
    // Reset form
    setAbsenceType('');
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  // Filtrar ausencias
  const filteredAbsences = absences.filter(absence => {
    return (
      absence.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === '' || statusFilter === 'Todos' || absence.status === statusFilter)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      
      <Sidebar />
      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Registro de Ausencias</h1>
          <div className="flex items-center">
            <span className="text-gray-600 mr-3">Bienvenido, Admin</span>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
              <i className="fas fa-user"></i>
            </div>
          </div>
        </header>
        
        {/* Panel de control */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Buscar empleado..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            
            <div className="flex space-x-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
              >
                <i className="fas fa-plus mr-2"></i> Nueva Ausencia
              </button>
            </div>
          </div>
          
          {/* Tabla de ausencias */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAbsences.map((absence) => {
                  const employee = employees.find(emp => emp.id === absence.employeeId);
                  return (
                    <tr key={absence.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
                            {employee?.avatar || '--'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{absence.employeeName}</div>
                            <div className="text-sm text-gray-500">{employee?.department || '--'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{absence.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(absence.startDate).toLocaleDateString()} - {new Date(absence.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.ceil((new Date(absence.endDate) - new Date(absence.startDate)) / (1000 * 60 * 60 * 24) + 1)}días
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          absence.status === 'Aprobado' ? 'bg-green-100 text-green-800' :
                          absence.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {absence.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">{absence.notes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <i className="fas fa-edit mr-1"></i> Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-trash-alt mr-1"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <div className="hidden md:flex">
                <span className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredAbsences.length}</span> de <span className="font-medium">{absences.length}</span> resultados
                </span>
              </div>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal de registro de ausencias */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {selectedEmployee ? `Registrar Ausencia para ${selectedEmployee.name}` : 'Nueva Ausencia'}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedEmployee(null);
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              {!selectedEmployee && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    onChange={(e) => {
                      const empId = parseInt(e.target.value);
                      const emp = employees.find(e => e.id === empId);
                      setSelectedEmployee(emp);
                    }}
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.name} ({employee.department})</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de ausencia</label>
                <select
                  value={absenceType}
                  onChange={(e) => setAbsenceType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {absenceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas (Opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Motivo de la ausencia, documentos adjuntos, etc."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
                >
                  Registrar Ausencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Incluir Font Awesome para los íconos */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </div>
  );
}