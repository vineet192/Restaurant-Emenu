import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileCard(props) {
  const [eMenus, setEmenus] = useState([]);
  const router = useRouter();
  const { currentUser } = useAuth();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;

  const addMenuButton = useRef();
  const addMenuForm = useRef();

  useEffect(async () => {
    let userMenus = await getUserMenuObj(currentUser.uid);
    let newMenus = [...eMenus];
    newMenus = userMenus;
    setEmenus(newMenus);
  }, []);

  return (
    <div className="h-full flex-auto flex justify-center items-center">
      <div className="m-2 p-5 shadow-lg flex flex-col items-center">
        <h1 className="text-4xl text-blue-500 font-extrabold my-5">
          DASHBOARD
        </h1>
        <ul>
          <li className="mx-2 my-4">
            <h1 className="text-2xl">You can find your E-menus here</h1>
          </li>
          <li className="mx-2 my-4 overflow-y-auto max-h-80">
            {eMenus.map((menu, index) => (
              <div
                className="border my-3 border-gray-400 py-2 px-4 flex justify-between items-center"
                key={index}>
                <a
                  href={HOST_URL + '/menu/' + menu._id}
                  className="underline m-2">
                  {menu.name}
                </a>{' '}
                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 text-white rounded p-2 mx-2"
                    onClick={() => emenuRedirect(menu._id)}>
                    Customize
                  </button>
                </div>
              </div>
            ))}
            <div
              className="border my-3 border-gray-400 p-2 hidden justify-between items-center flex-wrap"
              ref={addMenuForm}>
              <input
                type="text"
                placeholder="Enter a name for your new menu"
                className="p-2 outline-none border-b border-gray-400"></input>
              <div className="flex justify-between p-2">
                <button
                  className="mx-2 p-2 border border-gray-400"
                  onClick={saveMenuForUser}>
                  Save
                </button>
                <button
                  className="mx-2 p-2 border border-gray-400"
                  onClick={cancelNewMenu}>
                  Cancel
                </button>
              </div>
            </div>
          </li>
          <li className="flex justify-center">
            <button
              onClick={showMenuForm}
              ref={addMenuButton}
              className="outline-none block">
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  function emenuRedirect(menuID) {
    router.push('/menu-config/' + menuID);
  }

  function showMenuForm() {
    addMenuForm.current.classList.replace('hidden', 'flex');
    addMenuButton.current.classList.replace('block', 'hidden');
  }

  function hideMenuForm() {
    addMenuForm.current.classList.replace('flex', 'hidden');
    addMenuButton.current.classList.replace('hidden', 'block');
  }

  async function saveMenuForUser() {
    let menuName = addMenuForm.current.children[0].value;
    let currency = 'INR';

    let payload = {
      menuName: menuName,
      currency: currency,
    };
    let data = await fetch(SERVER_URL + '/menu/' + currentUser.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let res = await data.json();

    if (!res.success) {
      console.log(res.msg);
      return;
    }

    let userMenus = await getUserMenuObj(currentUser.uid);
    let newMenus = [...eMenus];
    newMenus = userMenus;
    setEmenus(newMenus);

    hideMenuForm();
  }

  function cancelNewMenu() {
    hideMenuForm();
  }

  async function getUserMenuObj(uid) {
    let menus = (await (await fetch(SERVER_URL + '/menu/' + uid)).json()).menus;
    return menus;
  }
}
