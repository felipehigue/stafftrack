import Link from 'next/link';
import { FaTachometerAlt, FaUsers, FaUserTag, FaCalendarAlt, FaCalendarTimes, FaTasks } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <nav className="w-64 bg-black text-white fixed h-screen p-5 shadow-lg">
      <div className="text-center mb-6 border-b border-gray-700 pb-4">
        <Link href="/" className="flex items-center justify-center font-bold text-xl">
          <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center border border-white mr-2">ST</div>
          <span>StaffTrack</span>
        </Link>
      </div>

      <ul className="space-y-2">
        <li>
          <Link href="/home" className="flex items-center px-5 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
            <FaTachometerAlt className="mr-2" /> <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/gestionpersonal" className="flex items-center px-5 py-2 bg-gray-700 text-white rounded">
            <FaUsers className="mr-2" /> <span>Gestión de Personal</span>
          </Link>
        </li>
        <li>
          <Link href="/asignacionroles" className="flex items-center px-5 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
            <FaUserTag className="mr-2" /> <span>Asignación de Roles</span>
          </Link>
        </li>
        <li>
          <Link href="/programacionturnos" className="flex items-center px-5 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
            <FaCalendarAlt className="mr-2" /> <span>Programación de Turnos</span>
          </Link>
        </li>
        <li>
          <Link href="/registroausencias" className="flex items-center px-5 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
            <FaCalendarTimes className="mr-2" /> <span>Registro de Ausencias</span>
          </Link>
        </li>
        <li>
          <Link href="/paneltareas" className="flex items-center px-5 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
            <FaTasks className="mr-2" /> <span>Panel de Tareas</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}