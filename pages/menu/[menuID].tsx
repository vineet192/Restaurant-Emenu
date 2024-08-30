import { faAngleDown, faAngleUp, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { useState, useRef } from 'react';


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

async function fetchMenu(menuID: string): Promise<MenuCard> {

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  try {
    const res = await fetch(`${SERVER_URL}/menu?menuID=${menuID}&isPreview=true`);

    if (!res.ok) {
      throw new Error("Bad request")
    }

    const data = await res.json();

    data.menu.categories.map(category => {
      return { ...category, expanded: false }
    })

    return data.menu

  } catch (err) {
    return null
  }

}

export async function getServerSideProps({ params }) {

  const menuCardProp = await fetchMenu(params.menuID)

  return {
    props: { menuCardProp },
  }
}


export default function ({ menuCardProp }) {

  const [menuCard, setMenuCard] = useState<MenuCard>(menuCardProp);
  const categoriesPopup = useRef<HTMLDivElement>();

  return (

    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={`${menuCard.name} menu`}></meta>
        <title>{menuCard.name}</title>
      </Head>

      <div className="w-full px-10 py-5 gap-10 flex flex-col">

        <h1 className="z-10 block
          text-center text-[color:var(--text)] relative
          after:absolute after:h-0.5
          after:w-[40%] after:rounded-full after:bg-[color:var(--accent1)]
          after:top-1/2 after:right-0 after:block after:-z-10

          before:absolute before:h-0.5 before:w-[40%] before:rounded-full
          before:bg-[color:var(--accent1)] before:top-1/2
          before:left-0 before:block before:-z-10">
          <span className='text-4xl lg:text-6xl z-10 bg-[color:var(--background)] px-5'>
            {menuCard.name}
          </span></h1>
        {menuCard.categories && menuCard.categories.map((category, categoryIndex) => (
          <div
            className="flex flex-col"
            key={categoryIndex}
            id={categoryIndex.toString()}
            onClick={e => toggleExpansion(e, categoryIndex)}>
            <div className="p-2 cursor-pointer border-b border-blue-500 flex justify-between">
              <h2 className="text-2xl lg:text-4xl text-[color:var(--accent1)] font-extrabold">
                {category.title}
              </h2>

              {category.expanded ?
                <FontAwesomeIcon id="icon" icon={faAngleUp} size='2x' className='mt-auto text-blue-500' /> :
                <FontAwesomeIcon id="icon" icon={faAngleDown} size='2x' className='mt-auto text-blue-500' />}

            </div>
            <hr />
            <div className="hidden p-2" id="dish-list">
              {category.dishes.map((dish, dishIndex) => (
                <div className='flex flex-col mb-5 text-[color:var(--text)]' key={dishIndex}>
                  <div className="flex flex-row justify-between items-center my-2 text-[color:var(--text)]" key={dishIndex}>
                    <h2 className="text-xl lg:text-2xl font-bold">{dish.dishName}</h2>
                    <span className='min-w-fit ml-5 italic'>{dish.dishPrice} </span>
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
        <h2 className="text-2xl font-extrabold">Categories</h2>
        <ul className="my-5">
          {menuCard.categories && menuCard.categories.map((category, index) => (
            <li key={index} className="my-2">
              <h2
                className="text-2xl cursor-pointer"
                onClick={() => { scrollToCategoryAndOpen(index) }}>
                {category.title}
              </h2>
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
        <h2>Menu</h2>
      </button>
    </>

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

    if (!menuCard.categories[index].expanded) {
      categoryDiv.click()
    }

    categoryDiv.scrollIntoView({ behavior: "smooth" });
  }
}
