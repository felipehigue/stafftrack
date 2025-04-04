import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


export default function UserIconButton() {
  return (
    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors duration-200">
      <FontAwesomeIcon icon={faUser} className="text-sm" />
    </div>
  );
}