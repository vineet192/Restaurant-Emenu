import Router from 'next/router';
import { useState } from 'react';

export default function ProfileCard(props) {
  const [eMenus, setEmenus] = useState([]);

  //TODO: connect this component to the user backend, and get the user's corresponding menus.

  useState(() => {
    //Get all of user's menus here. Hardcoding for now.
    let newEmenus = [...eMenus];
    newEmenus = [
      'http://my-menu-1.com',
      'http://my-menu-2.com',
      'http://my-menu-3.com',
      'http://my-menu-4.com',
    ];
    setEmenus(newEmenus);
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
            {eMenus.map((menuUrl) => (
              <div className="border my-3 border-gray-400 p-2 flex justify-center items-center">
                <a href={menuUrl}>{menuUrl}</a>{' '}
                <div className='flex justify-between items-center'>
                <button
                  className="bg-blue-500 text-white rounded p-2 mx-2"
                  onClick={emenuRedirect}>
                  Customize
                </button>
                <input type={'checkbox'} placeholder='MAke public?'></input>
                </div>
              </div>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );

  function emenuRedirect() {
    Router.push('/menu');
  }
}
