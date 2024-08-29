import { faAngleDown, faAngleUp, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';


type MenuCard = {
  name?: string,
  isPublic?: boolean,
  currency?: string,
  categories?: Array<Category>
}

type Category = {
  title: string,
  dishes: Array<Dish>,
  expanded?: boolean
}

type Dish = {
  dishName: string,
  dishDescription: string,
  dishPrice: number
}


export default function () {
  const router = useRouter();
  const menuID = router.query.menuID;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;

  const [menuCard, setMenuCard] = useState<MenuCard>({});
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const categoriesPopup = useRef<HTMLDivElement>();

  useEffect(() => {
    console.log(isLoading)
  }, [isLoading])

  useEffect(() => {
    fetchMenu().finally(() => setIsLoading(false))
  }, []);

  return (
    <div className=''>

      {isLoading &&
        <div className='fixed left-1/2 top-20 rounded-xl font-bold animate-pulse 
        bg-[color:var(--background2)] text-[color:var(--accent2)] p-3'>
          Loading
        </div>}
      <div className="w-full my-5 p-2 flex flex-col">
        <div className='w-2/3 h-0.5 bg-[color:var(--accent1)] mb-2 mx-auto' />
        <h1 className="text-6xl mx-auto font-[''] text-center text-[color:var(--text)]">{menuCard.name}</h1>
        <div className='w-2/3 h-0.5 bg-[color:var(--accent1)] mt-2 mx-auto' />
        {menuCard.categories && menuCard.categories.map((category, categoryIndex) => (
          <div
            className="flex flex-col my-10 mx-2"
            key={categoryIndex}
            id={categoryIndex.toString()}
            onClick={e => toggleExpansion(e, categoryIndex)}>
            <div className="p-2 cursor-pointer border-b border-blue-500 flex justify-between">
              <h1 className="text-4xl text-[color:var(--accent1)] font-extrabold">
                {category.title}
              </h1>

              {category.expanded ?
                <FontAwesomeIcon id="icon" icon={faAngleUp} size='2x' className='mt-auto text-blue-500' /> :
                <FontAwesomeIcon id="icon" icon={faAngleDown} size='2x' className='mt-auto text-blue-500' />}

            </div>
            <hr />
            <div className="hidden p-2" id="dish-list">
              {category.dishes.map((dish, dishIndex) => (
                <div className='flex flex-col mb-5 text-[color:var(--text)]' key={dishIndex}>
                  <div className="flex flex-row justify-between items-center my-2 text-[color:var(--text)]" key={dishIndex}>
                    <h1 className="text-2xl font-bold">{dish.dishName}</h1>
                    <span className='min-w-fit ml-5 italic underline'>{dish.dishPrice} </span>
                  </div>
                  <span className='text-[color:var(--text)]'>{dish.dishDescription}</span>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="hidden z-10 flex-col items-center bg-[color:var(--background2)] rounded-lg text-[color:var(--accent2)] fixed bottom-0 right-0 p-2 m-5"
        ref={categoriesPopup}>
        <h1 className="text-2xl font-extrabold">Categories</h1>
        <ul className="my-5">
          {menuCard.categories && menuCard.categories.map((category, index) => (
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
        className="fixed z-5 bottom-0 right-0 m-5 p-2 
        bg-[color:var(--background2)] text-[color:var(--accent2)] 
        rounded w-fit font-bold"
        onClick={handleOpenCategories}>
        <h1>Menu</h1>
      </button>
    </div>
  );

  async function fetchMenu() {

    setIsLoading(true)

    try {
      const res = await fetch(`${SERVER_URL}/menu?menuID=${menuID}&isPreview=true`);

      if (!res.ok) {
        throw new Error("Bad request")
      }

      const data = await res.json();
      setIsLoading(false)

      data.menu.categories.map(category => {
        return { ...category, expanded: false }
      })
      setMenuCard((prevState) => data.menu);
    } catch (err) {
      alert("An unexpected error occured")
      return
    }

  }

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

    if (!menuCard.categories[index].expanded) {
      categoryDiv.click()
    }

    categoryDiv.scrollIntoView({ behavior: "smooth" });
  }
}
