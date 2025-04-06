'use client'

import { useState, useEffect } from 'react'
import {
  FaTachometerAlt, FaUsers, FaUserTag, FaCalendarAlt, FaCalendarTimes,
  FaTasks, FaUser, FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa'
import Sidebar from '../components/Sidebar'

export default function Programacionturnos() {
  const [view, setView] = useState('Mes')
  const [modalOpen, setModalOpen] = useState(false)
  const [empleados, setEmpleados] = useState([])
  const [form, setForm] = useState({
    empleado: '',
    fecha: '',
    horaInicio: '',
    horaFin: ''
  })

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/empleados/')
        const data = await res.json()
        setEmpleados(data)
      } catch (err) {
        console.error('Error fetching empleados:', err)
      }
    }
    fetchEmpleados()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Nuevo turno:', form)
    setModalOpen(false)
    // Aquí puedes enviar los datos a la API o actualizarlos en tu estado
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 bg-white min-h-screen">
        <header className="flex justify-between items-center pb-6 border-b mb-6">
          <h1 className="text-2xl font-semibold">Programación de Turnos</h1>
          <div className="flex items-center gap-4">
            <span>Bienvenido, Admin</span>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
              <FaUser />
            </div>
          </div>
        </header>

        {/* Calendar controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"><FaChevronLeft /></button>
            <span className="text-lg font-semibold">Marzo 2023</span>
            <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"><FaChevronRight /></button>
            <button
              onClick={() => setModalOpen(true)}
              className="ml-4 px-4 py-2 bg-black text-white rounded flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <FaPlus /> Nuevo Turno
            </button>
          </div>
          <div className="flex gap-2">
            {['Día', 'Semana', 'Mes'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm border rounded ${view === v ? 'bg-black text-white border-black' : 'bg-white border-gray-300'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <table className="w-full border-collapse mb-6 text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                <th key={day} className="py-3 font-semibold">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 bg-gray-50 text-gray-400 align-top"><div className="font-semibold mb-1">27</div></td>
              <td className="border p-2 bg-gray-50 text-gray-400 align-top"><div className="font-semibold mb-1">28</div></td>
              <td className="border p-2 align-top">
                <div className="font-semibold mb-1">1</div>
                <div className="bg-blue-100 border-l-4 border-blue-600 rounded px-2 py-1 mb-1">
                  <div className="font-semibold">María González</div>
                  <div className="text-xs text-gray-600">08:00 - 16:00</div>
                </div>
                <div className="bg-green-100 border-l-4 border-green-600 rounded px-2 py-1">
                  <div className="font-semibold">Carlos Mendoza</div>
                  <div className="text-xs text-gray-600">16:00 - 00:00</div>
                </div>
              </td>
              <td className="border p-2 align-top"><div className="font-semibold mb-1">2</div></td>
              <td className="border p-2 align-top"><div className="font-semibold mb-1">3</div></td>
              <td className="border p-2 align-top"><div className="font-semibold">4</div></td>
              <td className="border p-2 align-top"><div className="font-semibold">5</div></td>
            </tr>
          </tbody>
        </table>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Asignar Nuevo Turno</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Empleado</label>
                  <select
                    name="empleado"
                    value={form.empleado}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((emp) => (
                      <option key={emp.id} value={emp.nombre}>
                        {emp.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Hora Inicio</label>
                    <input
                      type="time"
                      name="horaInicio"
                      value={form.horaInicio}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Hora Fin</label>
                    <input
                      type="time"
                      name="horaFin"
                      value={form.horaFin}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
      </main>
    </div>
  )
}
