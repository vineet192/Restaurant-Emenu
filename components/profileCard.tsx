import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileCard(props) {
  const [eMenus, setEmenus] = useState([]);
  const router = useRouter();
  const { currentUser } = useAuth();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;

  const addMenuButton = useRef<HTMLButtonElement>();
  const addMenuForm = useRef<HTMLDivElement>();

  useEffect(() => {
    initMenus()
  }, []);


  return (
    <div className="h-full flex-auto flex justify-center items-center">
      <div className="m-2 p-5 shadow-lg flex flex-col items-center">
        <h1 className="text-4xl text-blue-500 font-extrabold my-5">
          DASHBOARD
        </h1>
        <ul>
          <li className="mx-2 my-4 w-full text-center">
            <h1 className="text-2xl">You can find your E-menus here</h1>
          </li>
          <li className="mx-2 my-4 overflow-y-auto max-h-80">
            {eMenus != undefined && eMenus.map((menu, index) => (
              <div
                className="border my-3 border-gray-400 py-2 px-4 flex justify-between items-center"
                key={index}>
                <a
                  href={HOST_URL + '/menu/' + menu._id}
                  className="underline m-2 font-bold">
                  {menu.name}
                </a>{' '}
                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 text-white rounded p-2 mx-2"
                    onClick={() => emenuRedirect(menu._id)}>
                    Customize
                  </button>
                  <Link href={{
                    pathname: '/qr',
                    query: { id: menu._id }
                  }}>
                    <a>
                      <button
                        className="text-black border border-black rounded p-2 mx-2">
                        QR Code
                      </button>
                    </a>
                  </Link>
                  <button
                    className="outline-none block p-2 mx-2"
                    onClick={() => { deleteMenu(menu._id) }}>
                    <FontAwesomeIcon icon={faTrash} color='red'></FontAwesomeIcon>
                  </button>
                </div>
              </div>
            ))}
            {eMenus!= undefined && eMenus.length == 0 && <div className='w-full text-center'><span className='text-sm'>Start by adding a Menu below</span></div>}
            <div
              className="border my-3 border-gray-400 p-2 hidden justify-between items-center flex-wrap"
              ref={addMenuForm}>
              <input
                type="text"
                placeholder="Name"
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
              className="outline-none flex justify-between items-center border border-gray-500 p-2">
              Add a menu
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  async function initMenus(){
    const userMenus = await getUserMenuObj(currentUser.uid);
    setEmenus(userMenus);
  }

  function emenuRedirect(menuID: string) {
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
    let menuName = (addMenuForm.current.children[0] as HTMLInputElement).value;
    let currency = 'INR';

    let payload = {
      menuName: menuName,
      currency: currency,
      uid: currentUser.uid,
    };

    let res = await fetch(SERVER_URL + '/menu/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.status != 201) {
      //Insert error popup here
      return;
    }

    let userMenus = await getUserMenuObj(currentUser.uid);
    let newMenus = [...eMenus];
    newMenus = userMenus;
    setEmenus(newMenus);

    hideMenuForm();

    //Insert success popup here
  }

  function cancelNewMenu() {
    hideMenuForm();
  }

  async function getUserMenuObj(uid) {
    let menus = (await (await fetch(SERVER_URL + `/menu/?uid=${uid}`)).json()).menus;
    return menus;
  }

  function printQRCode(id) {

    let url = HOST_URL + '/menu/' + id

    console.log(`Print QR code for ${url}`)

  }

  async function deleteMenu(id) {
    let url = SERVER_URL + `/menu/`
    let res;

    let payload = {
      id: id
    }

    try {
      res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.log(err)
    }

    if (res.status != 200) {
      console.error("Error deleting menu")
      return
    }

    console.log("Deleted Successfully")
    router.reload()
  }
}
