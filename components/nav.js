import {
  faAlignJustify,
  faBars,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function NavBar() {
  const { logout, currentUser } = useAuth();
  const dropDownRef = useRef();
  const router = useRouter()
  const [show, setShow] = useState(true)

  useEffect(() => {
    console.log(window.location.pathname)

    if (currentUser === null || window.location.pathname.match(/^\/menu\/[a-zA-Z0-9]+\/*$/)) {
      setShow(false)
      return
    }

    setShow(true)
  }, [router.asPath])

  if (!show) return null

  return (
    <nav className="relative w-full top-0 z-50 bg-blue-800 text-white py-5">
      {/* Standard Desktop Nav */}
      <div className="hidden p-5 justify-between items-center md:flex">
        <a href="/" className="text-3xl font-extrabold">
          E-MENU
        </a>
        <ul className="flex justify-between items-center">
          <li className='mx-2 cursor-pointer  transition text-lg'>
            <Link href="/account">
              Account
            </Link>
          </li>
          <li className="mx-2 cursor-pointer  transition text-lg">
            <Link href="/about">
              About
            </Link>
          </li>
          <li
            onClick={onLogoutClick}
            className="mx-2 cursor-pointer  transition text-lg">
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
      <div ref={dropDownRef} className="px-2 w-full h-0 overflow-hidden transition-[height] duration-300 md:hidden">
        <ul className="w-full">
          <li className="w-full block text-left p-2 text-lg hover:bg-gray-200 hover:text-blue-500 outline-none transition cursor-pointer">
            <Link href="/account">
              Account
            </Link>
          </li>
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
    dropDownRef.current.classList.toggle("h-0")
    dropDownRef.current.classList.toggle("h-36")
  }
}
