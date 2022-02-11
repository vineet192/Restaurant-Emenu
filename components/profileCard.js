import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileCard(props) {
  const [eMenus, setEmenus] = useState([]);
  const router = useRouter();
  const { currentUser } = useAuth();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;

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
                className="border my-3 border-gray-400 p-2 flex justify-center items-center"
                key={index}>
                <a
                  href={HOST_URL + '/menu/' + menu._id}
                  className="underline m-2">
                  Preview
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
          </li>
        </ul>
      </div>
    </div>
  );

  function emenuRedirect(menuID) {
    Router.push('/menu-config/' + menuID);
  }

  async function getUserMenuObj(uid) {
    let menus = (await (await fetch(SERVER_URL + '/menu/' + uid)).json()).menus;
    return menus;
  }
}
