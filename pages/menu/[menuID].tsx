import { CategoriesPreview } from './../../components/CategoriesPreview';
import { faAngleDown, faAngleUp, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useState, useRef } from 'react';
import { MenuCard, CategoryPreview } from '../../types/types';

async function fetchMenu(menuID: string): Promise<MenuCard> {

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;

  const res = await fetch(`${SERVER_URL}/menu?menuID=${menuID}&isPreview=true`);

  if (!res.ok) {
    throw new Error("Bad request")
  }

  const data = await res.json();

  data.menu.categories.map((category: CategoryPreview): CategoryPreview => {
    return { ...category, expanded: false }
  })

  return data.menu

}

export async function getServerSideProps({ params, query }) {

  if (query && query.hasOwnProperty("preview")) {

    try {
      const menuCardProp: MenuCard = JSON.parse(Buffer.from(query.preview, 'base64').toString())

      return {
        props: { menuCardProp }
      }
    } catch (err: any) {
      return { menuCardProp: null }
    }
  }


  try {
    const menuCardProp = await fetchMenu(params.menuID)
    return { props: { menuCardProp }, }

  } catch (err: any) {
    return { props: { menuCardProp: null }, }
  }
}


export default function Menu({ menuCardProp }) {

  const [menuCard, setMenuCard] = useState<MenuCard>(menuCardProp);
  const categoriesPopup = useRef<HTMLDivElement>();
  const router = useRouter()

  if (!menuCardProp) {
    router.push("/")
    alert("We're having trouble finding this menu!")
    return null
  }

  return (

    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={`${menuCard?.name} menu`}></meta>
        <title>{menuCard?.name}</title>
      </Head>

      <div className="w-full px-10 py-5 gap-10 flex flex-col">

        <div className="z-10
          text-center text-[color:var(--text)] relative flex justify-center
          after:absolute after:h-0.5
          after:w-[40%] after:rounded-full after:bg-[color:var(--accent1)]
          after:top-1/2 after:right-0 after:block after:-z-10

          before:absolute before:h-0.5 before:w-[40%] before:rounded-full
          before:bg-[color:var(--accent1)] before:top-1/2
          before:left-0 before:block before:-z-10">
          <h1 className='text-2xl lg:text-6xl max-w-[70%] bg-[color:var(--background)] px-2 break-words'>
            {menuCard?.name}
          </h1></div>
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

      <CategoriesPreview
        categoriesPopup={categoriesPopup}
        categories={menuCard.categories}
        scrollToCategoryAndOpen={scrollToCategoryAndOpen}
        handleCloseCategories={handleCloseCategories} />

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
