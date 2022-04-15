import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export default function () {
  const router = useRouter();
  const menuID = router.query.menuID;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;

  const [menuCard, setMenuCard] = useState({});

  const categoriesPopup = useRef();

  useEffect(async () => {
    let res = await fetch(
      `${SERVER_URL}/menu?menuID=${menuID}`
    );
    let data = await res.json();
    console.log(data.menu);
    setMenuCard((prevState) => data.menu);
  }, []);

  if (Object.keys(menuCard).length == 0) {
    return null;
  }

  return (
    <div>
      <button
        className="absolute bottom-0 right-0 m-5 p-2 flex bg-blue-500 text-white rounded w-fit"
        onClick={handleOpenCategories}>
        <h1>Menu</h1>
      </button>

      <div
        className="hidden flex-col items-center bg-blue-500 rounded-lg text-white fixed bottom-0 right-0 p-2 m-5"
        ref={categoriesPopup}>
        <h1>Categories</h1>
        <ul className="my-5">
          {menuCard.categories.map((category, index) => (
            <li key={index}>
              <h1>{category.title}</h1>
            </li>
          ))}
        </ul>
        <button
          className="absolute bottom-0 right-0 p-1"
          onClick={handleCloseCategories}>
          <FontAwesomeIcon icon={faBackspace}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );

  function handleCloseCategories(event) {
    categoriesPopup.current.classList.replace('flex', 'hidden');
  }

  function handleOpenCategories(event) {
    categoriesPopup.current.classList.replace('hidden', 'flex');
  }
}
