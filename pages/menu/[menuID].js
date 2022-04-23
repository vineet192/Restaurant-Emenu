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
    let res = await fetch(`${SERVER_URL}/menu?menuID=${menuID}`);
    let data = await res.json();
    console.log(data.menu);
    setMenuCard((prevState) => data.menu);
  }, []);

  if (Object.keys(menuCard).length == 0) {
    return null;
  }

  return (
    <div>
      <div className="w-4/5 m-5 p-2 flex flex-col">
        {menuCard.categories.map((category, categoryIndex) => (
          <div
            className="flex flex-col my-10 mx-2"
            key={categoryIndex}
            onClick={toggleDishes}>
            <div className="rounded-md p-2 shadow-md cursor pointer">
              <h1 className="text-4xl text-blue-600 font-extrabold">
                {category.title}
              </h1>
            </div>
            <hr />
            <div className="hidden p-2" id="dish-list">
              {category.dishes.map((dish, dishIndex) => (
                <div className="flex flex-col my-2" key={dishIndex}>
                  <h1 className="text-2xl">{dish.dishName}</h1>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="hidden z-10 flex-col items-center bg-blue-500 rounded-lg text-white fixed bottom-0 right-0 p-2 m-5"
        ref={categoriesPopup}>
        <h1 className="text-2xl font-extrabold">Categories</h1>
        <ul className="my-5">
          {menuCard.categories.map((category, index) => (
            <li key={index} className="my-2">
              <h1 className="text-2xl">{category.title}</h1>
            </li>
          ))}
        </ul>
        <button
          className="absolute bottom-0 right-0 p-1"
          onClick={handleCloseCategories}>
          <FontAwesomeIcon icon={faBackspace}></FontAwesomeIcon>
        </button>
      </div>

      <button
        className="fixed z-5 bottom-0 right-0 m-5 p-2 bg-blue-500 text-white rounded w-fit"
        onClick={handleOpenCategories}>
        <h1>Menu</h1>
      </button>
    </div>
  );

  function handleCloseCategories(event) {
    categoriesPopup.current.classList.replace('flex', 'hidden');
  }

  function handleOpenCategories(event) {
    categoriesPopup.current.classList.replace('hidden', 'flex');
  }

  function toggleDishes(event) {
    let dishList = event.currentTarget.querySelector('#dish-list');
    dishList.classList.toggle('hidden');
  }
}
