import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { AnimationEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import { errorToast, successToast } from '../static/toastConfig';
import AddDishButton from './buttons/addDishButton';
import { EditMenuNameToggle } from './buttons/EditMenuNameToggle';
import PreviewButton from './buttons/previewButton';
import { SaveChangesButton } from './buttons/saveChangesButton';
import { CategoriesConfigList } from './CategoriesConfigList';
import DishCard from './dishCard';
import { CategoryPreview, CategoryConfig, Dish, MenuCard, MenuFormProps } from '../types/types';
import React from 'react';

export default function MenuForm({ menuID }: MenuFormProps) {
  const [categories, setCategories] = useState<CategoryConfig>({}); //structure shown above.
  const [numCategories, setNumCategories] = useState(0);
  const [currentTabId, setCurrentTabId] = useState(-1); //Current category of dish selected by user (in focus)
  const [menuName, setMenuName] = useState('');
  const [isMenuLoading, setIsMenuLoading] = useState(true)
  const imageFormDataRef = useRef(new FormData()) //These images will be POSTed after the text payload
  const { currentUser } = useAuth();
  const formRef = useRef<HTMLFormElement>();
  const saveFormButtonRef = useRef<HTMLButtonElement>();
  const editMenuNameFieldRef = useRef<HTMLInputElement>();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;
  const router = useRouter()

  useEffect(() => {
    fetchMenu().finally(() => setIsMenuLoading(false))
  }, []);

  return (
    <>
      {/* Loading Spinner */}
      {isMenuLoading && <div className="p-2 w-fit mx-auto mt-3 rounded-lg bg-[color:var(--text)] 
                text-[color:var(--accent2)] font-bold animate-pulse">
        Loading...
      </div>}
      <form
        className="w-full h-full"
        ref={formRef}
        onSubmit={(event) => event.preventDefault()}>
        <div className="flex justify-center items-center mb-10">
          <div className="flex">
            <input
              ref={editMenuNameFieldRef}
              type="text"
              size={5}
              disabled={true}
              className="text-6xl m-2 font-bold text-[color:var(--text)] border-b-2 border-transparent transition bg-transparent text-center w-auto focus:border-[color:var(--accent2)]"
              value={menuName}
              //OnBlur is used to capture onFocusOut
              onBlur={(event) => {
                event.currentTarget.disabled = true;
              }}
              onChange={handleMenuNameChange}></input>
            <EditMenuNameToggle toggleMenuNameEdit={toggleMenuNameEdit} faEdit={faEdit} />
          </div>
        </div>

        <div className='flex lg:flex-nowrap sm:flex-wrap flex-wrap flex-shrink w-full'>
          <CategoriesConfigList
            addCategory={addCategory}
            setNumCategories={setNumCategories}
            numCategories={numCategories}
            handleCategoryNameChange={handleCategoryNameChange}
            handleCategorySelect={handleCategorySelect}
            handleRemoveCategoryClick={handleRemoveCategoryClick}
            categories={categories} />


          <div className="p-2 my-2 flex-col items-center w-full">
            {currentTabId != -1 ? <>
              <h1 className=" text-4xl text-[color:var(--accent1)] font-extrabold p-2 w-full">
                {currentTabId > -1 ? categories[currentTabId].title : ''}
              </h1>
              <hr className="text-[color:var(--accent1)]"></hr>

              <div className='flex w-full items-center justify-center'>
                <AddDishButton
                  onClick={(event) => {
                    handleAddDish({
                      dishName: '',
                      dishDescription: '',
                      dishPrice: '0.0',
                    });
                  }}></AddDishButton>
              </div>

              {/* List of Dishes. User can add dish name and description. */}
              {currentTabId > -1 ? <div className="flex flex-col justify-center mr-20">
                {categories[currentTabId].dishes.map((dish, index) => <DishCard
                  key={index}
                  dishName={dish.dishName}
                  dishPrice={dish.dishPrice}
                  dishDescription={dish.dishDescription}
                  onRemove={() => handleRemoveDish(index)}
                  onDishNameChange={(event) => handleDishNameChange(event, index)}
                  onDishDescriptionChange={(event) => handleDishDescriptionChange(event, index)}
                  onPriceChange={(event) => handlePriceChange(event, index)}
                  onImageChange={(event) => handleDishImageChange(event, index)}/>)}
              </div> : null}
            </> : null}
          </div>
        </div>

        <div className="px-3 fixed bottom-0 right-0 flex justify-end align-center">
          <SaveChangesButton saveFormButtonRef={saveFormButtonRef} handleFormSave={handleFormSave} faSave={faSave} />
          <PreviewButton onClick = {previewMenuCard} preview_url={HOST_URL + '/menu/' + menuID}></PreviewButton>
        </div>
        <ToastContainer />
      </form>
    </>
  );

  async function fetchMenu() {
    //get current menu obj from user
    try {
      const res = await fetch(SERVER_URL + `/menu/?menuID=${menuID}&uid=${currentUser.uid}&isPreview=false`);

      if (res.status === 403) {
        alert("You aren't allowed to edit this menu!")
        router.push("/")
        return
      }

      const menu = (await res.json()).menu;

      setMenuName(menu.name);

      let newCategories = { ...categories };
      menu.categories.forEach((element, index) => {
        newCategories[index] = element;
      });

      if (Object.keys(newCategories).length == 0) {
        newCategories[0] = { "dishes": [], "title": "Appetizers" }
      }

      setCategories(newCategories);
      setNumCategories(menu.categories.length);
    } catch (err) {
      alert('Something went wrong fetching your details');
      return;
    }
  }

  function handleAddDish(dish) {
    let newCategories = { ...categories };
    newCategories[currentTabId].dishes.push(dish);
    setCategories(newCategories);
  }

  function addCategory(categoryId) {
    let newCategories = {
      ...categories,
    };

    newCategories[categoryId] = { title: '', dishes: [] };
    setCategories(newCategories);
  }

  function handleRemoveCategoryClick(event) {

    if (Object.keys(categories).length <= 1) {
      alert("You must have at least one category!")
      return
    }

    let id = event.currentTarget.parentElement.id;

    let categoryInput = event.currentTarget.parentElement.querySelector("input")

    categoryInput.style.width = 0

    let newCategories = { ...categories };
    setCurrentTabId(-1);
    delete newCategories[id];

    setCategories(newCategories);
  }

  function handleRemoveDish(index: number) {
    let newCategories = { ...categories };
    newCategories[currentTabId].dishes.splice(index, 1)
    setCategories(newCategories);
  }

  function handlePriceChange(event, index) {
    let newCategories = { ...categories };
    newCategories[currentTabId].dishes[index].dishPrice =
      event.currentTarget.value;
    setCategories(newCategories);
  }

  function handleDishNameChange(event, index) {
    //update the dish name
    let newCategories = { ...categories };
    newCategories[currentTabId].dishes[index].dishName =
      event.currentTarget.value;
    setCategories(newCategories);
  }

  function handleDishDescriptionChange(event, index) {
    //update the dish description
    let newCategories = { ...categories };
    newCategories[currentTabId].dishes[index].dishDescription =
      event.currentTarget.value;
    setCategories(newCategories);
  }

  // Keeps track of dish images in a formData as a 
  // KV pair. format : "<categoryTitle>:<dishIndex>" -> <File obj>
  function handleDishImageChange(event, index) {

    if (event.currentTarget.files.length === 0) return

    imageFormDataRef.current
      .append(`${categories[currentTabId].title}:${index}`, event.currentTarget.files[0])

  }

  function handleMenuNameChange(event) {
    setMenuName(event.currentTarget.value);
  }

  function handleCategoryNameChange(event) {
    let category = event.currentTarget.value;
    let id = event.currentTarget.parentElement.id;

    let newCategories = { ...categories };
    newCategories[id].title = category;

    setCategories(newCategories);
  }

  function handleCategorySelect(event) {
    let id = event.currentTarget.parentElement.id;
    setCurrentTabId(id);
  }

  function toggleMenuNameEdit(event) {
    editMenuNameFieldRef.current.disabled = false;
    editMenuNameFieldRef.current.focus();
  }

  function previewMenuCard(){
    const menuCard: MenuCard = {}

    menuCard.categories = Object.values(categories) as CategoryPreview[]
    menuCard.name = menuName
    
    const menuCardEncoded = window.btoa(JSON.stringify(menuCard))

    router.push(`/menu/preview?preview=${menuCardEncoded}`)
  }

  async function handleFormSave(event: FormEvent) {

    saveFormButtonRef.current.classList.toggle("animate-pulse")
    await uploadMenuUpdates()
    // await uploadMenuImageUpdates()
    saveFormButtonRef.current.classList.toggle("animate-pulse")
  }

  async function uploadMenuUpdates() {

    let menuEdits = { categories: Object.values(categories), name: menuName };

    let payload = {
      menuID: menuID,
      uid: currentUser.uid,
      newMenu: menuEdits,
    };

    let requestOptions: RequestInit = {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    };

    try {
      const res = await fetch(SERVER_URL + '/menu/', requestOptions);
      if (!res.ok) throw new Error()
      successToast("Menu saved successfully!")

    } catch (err) {
      errorToast('Error saving menu');
      return
    }
  }

  async function uploadMenuImageUpdates() {
    let requestOptions: RequestInit = {
      method: "PATCH",
      body: imageFormDataRef.current,
      redirect: "follow"
    };

    try {
      const res = await fetch(SERVER_URL + "/menu/images", requestOptions)
      if (!res.ok) throw new Error()
    } catch (err) {
      errorToast("Error updating images")
      return
    }

    successToast("Menu saved successfully!")
  }
}
