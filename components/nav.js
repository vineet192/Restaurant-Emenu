import {
  faAlignJustify,
  faBars,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { logout, currentUser } = useAuth();
  const dropDownRef = useRef();

  if (currentUser === null) {
    return null;
  }

  return (
    <nav className="relative w-full top-0 z-50">
      {/* Standard Desktop Nav */}
      <div className="hidden p-5 justify-between items-center md:flex">
        <a href="/" className="text-3xl font-extrabold">
          E-MENU
        </a>
        <ul className="flex justify-between items-center">
          <li className="mx-2 cursor-pointer hover:text-blue-500 transition text-lg">
            About
          </li>
          <li
            onClick={onLogoutClick}
            className="mx-2 cursor-pointer hover:text-blue-500 transition text-lg">
            Logout
          </li>
        </ul>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex justify-between items-center p-5">
        <h1 className="text-3xl font-extrabold">E-MENU</h1>
        <button onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faBars} size="2x"></FontAwesomeIcon>
        </button>
      </div>

      {/* Dropdown nav items */}
      <div ref={dropDownRef} className="p-2 w-full hidden transition md:hidden">
        <ul className="w-full">
          <li className="w-full block text-left p-2 text-lg hover:bg-gray-200 hover:text-blue-500 outline-none transition cursor-pointer">
            About
          </li>
          <li
            onClick={onLogoutClick}
            className="w-full block text-left p-2 text-lg hover:bg-gray-200 hover:text-blue-500 outline-none transition cursor-pointer">
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );

  async function onLogoutClick() {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  }

  function toggleDropdown(event) {
    dropDownRef.current.classList.toggle('hidden');
  }
}
