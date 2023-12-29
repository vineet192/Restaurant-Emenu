import { faAngleDown, faAngleUp, faBackspace } from '@fortawesome/free-solid-svg-icons';
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

    data.menu.categories.map(category => {
      return { ...category, expanded: false }
    })
    setMenuCard((prevState) => data.menu);
  }, []);

  if (Object.keys(menuCard).length == 0) {
    return null;
  }

  return (
    <div>
      <div className="w-full m-5 p-2 flex flex-col">
        <div className='w-2/3 h-0.5 bg-black mb-2 mx-auto' />
        <h1 className="text-6xl mx-auto font-[''] text-center">{menuCard.name}</h1>
        <div className='w-2/3 h-0.5 bg-black mt-2 mx-auto' />
        {menuCard.categories.map((category, categoryIndex) => (
          <div
            className="flex flex-col my-10 mx-2"
            key={categoryIndex}
            id={categoryIndex}
            onClick={e => toggleExpansion(e, categoryIndex)}>
            <div className="p-2 cursor-pointer border-b border-blue-500 flex justify-between">
              <h1 className="text-4xl text-blue-600 font-extrabold">
                {category.title}
              </h1>

              {category.expanded ?
                <FontAwesomeIcon id="icon" icon={faAngleUp} size='2x' className='mt-auto text-blue-500' /> :
                <FontAwesomeIcon id="icon" icon={faAngleDown} size='2x' className='mt-auto text-blue-500' />}

            </div>
            <hr />
            <div className="hidden p-2" id="dish-list">
              {category.dishes.map((dish, dishIndex) => (
                <div className='flex flex-col mb-5' key={dishIndex}>
                  <div className="flex flex-row justify-between items-center my-2" key={dishIndex}>
                    <h1 className="text-2xl font-bold">{dish.dishName}</h1>
                    <span className='min-w-fit ml-5 italic underline'>{dish.dishPrice + " " + menuCard.currency} </span>
                  </div>
                  <span>{dish.dishDescription}</span>
                  <hr />
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
              <h1
                className="text-2xl cursor-pointer"
                onClick={() => { scrollToCategoryAndOpen(index) }}>
                {category.title}
              </h1>
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

  function toggleExpansion(event, categoryIndex) {
    let dishList = event.currentTarget.querySelector('#dish-list');
    let isHidden = dishList.classList.toggle('hidden');

    let newMenuCard = { ...menuCard }
    newMenuCard.categories[categoryIndex].expanded = !isHidden
    setMenuCard(newMenuCard)
  }

  function scrollToCategoryAndOpen(index) {
    let categoryDiv = document.getElementById(index)
    categoryDiv.scrollIntoView({ behavior: "smooth" });

    if (!menuCard.categories[index].expanded) {
      categoryDiv.click()
    }
  }
}
