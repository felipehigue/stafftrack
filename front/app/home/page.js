"use client";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import UserIconButton from "../components/icon";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
  };

  const navItems = [
    { icon: "tachometer-alt", text: "Dashboard", id: "dashboard", path: "/home" },
    { icon: "users", text: "Gestión de Personal", id: "staff", path: "/gestionpersonal" },
    { icon: "user-tag", text: "Asignación de Roles", id: "roles", path: "#" },
    { icon: "calendar-alt", text: "Programación de Turnos", id: "shifts", path: "#" },
    { icon: "calendar-times", text: "Registro de Ausencias", id: "absences", path: "#" },
    { icon: "tasks", text: "Panel de Tareas", id: "tasks", path: "#" },
  ];

  const summaryCards = [
    { title: "Personal Activo", value: "142" },
    { title: "Ausencias Hoy", value: "8" },
    { title: "Tareas Pendientes", value: "23" },
  ];

  return (
    <>
      <Head>
        <title>StaffTrack - Dashboard</title>
        <meta name="description" content="Panel de control de StaffTrack" />
      </Head>

      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`bg-black text-white fixed h-screen transition-all duration-300 z-50 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="p-5 border-b border-gray-700 flex items-center justify-between">
            <a href="#" className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center text-white font-bold bg-gray-800 rounded-full border border-white">
                ST
              </div>
              {sidebarOpen && (
                <span className="font-bold ml-3 transition-opacity duration-300">
                  StaffTrack
                </span>
              )}
            </a>

            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none ml-3"
              aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <i
                className={`fas fa-chevron-${sidebarOpen ? "left" : "right"} text-lg`}
              ></i>
            </button>
          </div>

          <nav className="mt-5">
            <ul>
              {navItems.map((item) => (
                <li key={item.id} className="mb-1">
                  <Link
                    href={item.path}
                    className={`flex items-center p-3 transition-colors ${
                      sidebarOpen ? "px-5" : "justify-center"
                    } text-gray-300 hover:bg-gray-800 hover:text-white ${
                      activeNav === item.id
                        ? "bg-gray-800 text-white border-l-4 border-white"
                        : ""
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <i className={`fas fa-${item.icon} text-lg ${sidebarOpen ? "mr-3" : ""}`} />
                    {sidebarOpen && <span>{item.text}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
          <div className="p-8">
            <header className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span>Bienvenido, Admin</span>
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer">
                  <UserIconButton />
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {summaryCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <h3 className="text-sm text-gray-500 mb-2">{card.title}</h3>
                  <p className="text-3xl font-semibold">{card.value}</p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <h2 className="text-lg mb-4 pb-2 border-b border-gray-200">
                  Últimas Actividades
                </h2>
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 h-80 flex items-center justify-center">
                  <p className="text-gray-500">Gráfico o lista de actividades recientes</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg mb-4 pb-2 border-b border-gray-200">Turnos Hoy</h2>
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 h-80 flex items-center justify-center">
                  <p className="text-gray-500">Lista de turnos programados para hoy</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
