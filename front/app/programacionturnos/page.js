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
  const [turnos, setTurnos] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [form, setForm] = useState({
    codigo_empleado: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Obtener empleados y turnos al cargar el componente y cuando cambia la semana
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const fechaActual = currentDate.toISOString().split('T')[0]
        
        const [empleadosRes, turnosRes] = await Promise.all([
          fetch('http://localhost:8000/api/empleados/'),
          fetch(`http://localhost:8000/api/turnos/por_semana/?fecha=${fechaActual}&t=${Date.now()}`)
        ])

        if (!empleadosRes.ok || !turnosRes.ok) {
          throw new Error('Error al cargar datos')
        }

        const [empleadosData, turnosData] = await Promise.all([
          empleadosRes.json(),
          turnosRes.json()
        ])

        setEmpleados(empleadosData)
        setTurnos(turnosData.map(t => ({
          ...t,
          fecha: t.fecha.split('T')[0] // Normalizar formato de fecha
        })))
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Error al cargar los datos. Intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validar que no exista ya un turno para este empleado en la misma fecha
      const turnoExistente = turnos.some(t => 
        t.codigo_empleado === form.codigo_empleado && 
        t.fecha === form.fecha
      )

      if (turnoExistente) {
        throw new Error('Este empleado ya tiene un turno asignado para esta fecha')
      }

      // Crear el nuevo turno
      const response = await fetch('http://localhost:8000/api/turnos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          fecha: new Date(form.fecha).toISOString().split('T')[0] // Formato consistente
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.non_field_errors?.join(', ') || 'Error al crear turno')
      }

      const nuevoTurno = await response.json()

      // Actualizar el estado de turnos con el nuevo turno
      setTurnos(prev => [
        ...prev,
        {
          ...nuevoTurno,
          fecha: nuevoTurno.fecha.split('T')[0] // Normalizar formato
        }
      ])

      // Cerrar modal y resetear formulario
      setModalOpen(false)
      setForm({
        codigo_empleado: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: ''
      })

    } catch (err) {
      console.error('Error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Navegación entre semanas
  const changeWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7))
      return newDate
    })
  }

  // Formatear fecha como "Mes Año"
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  // Generar días de la semana actual (desde el lunes)
  const getWeekDays = () => {
    const startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7)) // Ajuste para que empiece en lunes
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      return date
    })
  }

  // Obtener turnos para un día específico
  const getTurnosForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return turnos.filter(turno => turno.fecha === dateStr)
  }

  // Renderizar los turnos de un día
  const renderTurnos = (turnosDelDia) => {
    if (!turnosDelDia || turnosDelDia.length === 0) return null

    return turnosDelDia.map((turno, i) => (
      <div 
        key={`${turno.id || i}_${turno.fecha}`}
        className={`${i % 2 === 0 ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-green-100 border-l-4 border-green-600'} rounded px-2 py-1 mb-1`}
      >
        <div className="font-semibold">
          {turno.empleado_nombre?.split(' - ')[0] || 'Sin nombre'}
        </div>
        <div className="text-xs text-gray-600">
          {turno.hora_inicio?.slice(0, 5) || '--:--'} - {turno.hora_fin?.slice(0, 5) || '--:--'}
        </div>
      </div>
    ))
  }

  const weekDays = getWeekDays()

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
            <button 
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50"
              onClick={() => changeWeek('prev')}
              disabled={loading}
            >
              <FaChevronLeft />
            </button>
            <span className="text-lg font-semibold">
              {formatMonthYear(currentDate)}
            </span>
            <button 
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50"
              onClick={() => changeWeek('next')}
              disabled={loading}
            >
              <FaChevronRight />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="ml-4 px-4 py-2 bg-black text-white rounded flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
              disabled={loading}
            >
              <FaPlus /> Nuevo Turno
            </button>
          </div>
          <div className="flex gap-2">
            {['Día', 'Semana', 'Mes'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                disabled={loading}
                className={`px-4 py-2 text-sm border rounded ${view === v ? 'bg-black text-white border-black' : 'bg-white border-gray-300'} disabled:opacity-50`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
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
                {weekDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                  const dayTurnos = getTurnosForDay(day)
                  
                  return (
                    <td 
                      key={index}
                      className={`border p-2 ${isCurrentMonth ? 'align-top' : 'bg-gray-50 text-gray-400 align-top'}`}
                    >
                      <div className="font-semibold mb-1">{day.getDate()}</div>
                      {renderTurnos(dayTurnos)}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        )}

        {/* Modal para nuevo turno */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Asignar Nuevo Turno</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Empleado</label>
                  <select
                    name="codigo_empleado"
                    value={form.codigo_empleado}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((emp) => (
                      <option key={emp.codigo_empleado} value={emp.codigo_empleado}>
                        {emp.nombre} {emp.apellido} - {emp.codigo_empleado}
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
                    disabled={loading}
                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Hora Inicio</label>
                    <input
                      type="time"
                      name="hora_inicio"
                      value={form.hora_inicio}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Hora Fin</label>
                    <input
                      type="time"
                      name="hora_fin"
                      value={form.hora_fin}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      setError(null)
                    }}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin inline-block">↻</span>
                        Guardando...
                      </>
                    ) : 'Guardar'}
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