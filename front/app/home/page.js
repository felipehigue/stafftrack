
"use client";
import React, { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('dashboard')

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNavClick = (navItem) => {
    setActiveNav(navItem)
  }

  const navItems = [
    { icon: 'tachometer-alt', text: 'Dashboard', id: 'dashboard' },
    { icon: 'users', text: 'Gestión de Personal', id: 'staff' },
    { icon: 'user-tag', text: 'Asignación de Roles', id: 'roles' },
    { icon: 'calendar-alt', text: 'Programación de Turnos', id: 'shifts' },
    { icon: 'calendar-times', text: 'Registro de Ausencias', id: 'absences' },
    { icon: 'tasks', text: 'Panel de Tareas', id: 'tasks' },
  ]

  const summaryCards = [
    { title: 'Personal Activo', value: '142' },
    { title: 'Ausencias Hoy', value: '8' },
    { title: 'Tareas Pendientes', value: '23' },
  ]

  return (
    <>
      <Head>
        <title>StaffTrack - Dashboard</title>
        <meta name="description" content="Panel de control de StaffTrack" />
      </Head>

      <div className="flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`bg-black text-white h-screen fixed transition-all duration-300 z-10 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="p-5 border-b border-gray-700 flex justify-between items-center">
            <a href="#" className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center border border-white mr-3">
                ST
              </div>
              {sidebarOpen && <span className="font-bold">StaffTrack</span>}
            </a>
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
            >
              <i
                className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}
              ></i>
            </button>
          </div>

          <nav className="mt-5">
            <ul>
              {navItems.map((item) => (
                <li key={item.id} className="mb-1">
                  <a
                    href="#"
                    className={`flex items-center p-3 ${
                      sidebarOpen ? 'px-5' : 'justify-center'
                    } text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                      activeNav === item.id
                        ? 'bg-gray-800 text-white border-l-4 border-white'
                        : ''
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <i
                      className={`fas fa-${item.icon} ${
                        sidebarOpen ? 'mr-3' : ''
                      } text-lg`}
                    ></i>
                    {sidebarOpen && <span>{item.text}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <div className="flex items-center">
                <span>Bienvenido, Admin</span>
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center ml-4 cursor-pointer">
                  <i className="fas fa-user"></i>
                </div>
              </div>
            </header>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {summaryCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
                >
                  <h3 className="text-sm text-gray-500 mb-2">{card.title}</h3>
                  <p className="text-3xl font-semibold">{card.value}</p>
                </div>
              ))}
            </section>

            {/* Main Content Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <h2 className="text-lg mb-4 pb-2 border-b border-gray-200">
                  Últimas Actividades
                </h2>
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 h-80 flex items-center justify-center">
                  <p className="text-gray-500">
                    Gráfico o lista de actividades recientes
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-lg mb-4 pb-2 border-b border-gray-200">
                  Turnos Hoy
                </h2>
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 h-80 flex items-center justify-center">
                  <p className="text-gray-500">
                    Lista de turnos programados para hoy
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}