import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useEffect, useRef, useState } from 'react';
import AddCategoryButton from './buttons/addCategoryButton';
import AddDishButton from './buttons/addDishButton';
import RemoveCategoryButton from './buttons/removeCategoryButton';
import DishCard from './dishCard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import { errorToast, successToast } from '../static/toastConfig';
import { useRouter } from 'next/router';
import PreviewButton from './buttons/previewButton';
import CategoryNameInput from './input/categoryNameInput';

type Category = {
  [categoryId: string]: {
    title: string,
    dishes: Array<Dish>
  }
}

type Dish = {
  dishName: string,
  dishDescription: string,
  dishPrice: string
}

type MenuFormProps = {
  menuID: string
}

export default function MenuForm({menuID}: MenuFormProps) {
  const [categories, setCategories] = useState<Category>({}); //structure shown above.
  const [numCategories, setNumCategories] = useState(0);
  const [currentTabId, setCurrentTabId] = useState(-1); //Current category of dish selected by user (in focus)
  const [menuName, setMenuName] = useState('');
  const [isMenuLoading, setIsMenuLoading] = useState(false)
  const imageFormDataRef = useRef(new FormData()) //These images will be POSTed after the text payload
  const { currentUser } = useAuth();
  const formRef = useRef<HTMLFormElement>();
  const categoriesDiv = useRef<HTMLDivElement>();
  const saveFormButtonRef = useRef<HTMLButtonElement>();
  const editMenuNameFieldRef = useRef<HTMLInputElement>();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;
  const router = useRouter()

  useEffect(() => {
    setIsMenuLoading(true)
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
            <button onClick={toggleMenuNameEdit}>
              <FontAwesomeIcon
                icon={faEdit}
                size="2x"
                className="text-[color:var(--text)]"
              />
            </button>
          </div>
        </div>

        <div className='flex lg:flex-nowrap sm:flex-wrap flex-wrap flex-shrink w-full'>
          <div className="flex p-10 align-center flex-col rounded-xl ml-5 mb-5 mr-10 lg:w-2/5 sm:w-full max-h-[500px] overflow-y-auto">
            <div className="flex justify-center">
              <AddCategoryButton
                icon={faPlus}
                onClick={() => {
                  addCategory((numCategories + 1).toString());
                  setNumCategories(numCategories + 1);
                }}></AddCategoryButton>
            </div>

            <div className="flex flex-nowrap justify-center align-center p-2 overflow-x-hidden">
              <div className="flex flex-row overflow-auto lg:flex-col sm:flex-row" ref={categoriesDiv}>
                {/* List of categories as a horizontally scrollable list */}
                {Object.keys(categories).map((key) => {
                  return (
                    <div className="p-2 m-2 flex" key={key} id={key}>
                      <CategoryNameInput
                        onChange={handleCategoryNameChange}
                        onFocus={handleCategorySelect}
                        value={categories[key].title}></CategoryNameInput>
                      <RemoveCategoryButton
                        id={key}
                        onClick={handleRemoveCategoryClick}></RemoveCategoryButton>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {currentTabId != -1 ? (
            <div className="p-2 my-2 flex-col items-center w-full">
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
              {currentTabId > -1 ? (
                <div className="flex flex-col justify-center mr-20">
                  {categories[currentTabId].dishes.map((dish, index) => {
                    return (
                      <DishCard
                        key={index}
                        onRemove={(event) => handleRemoveDishClick(event, index)}
                        dishName={categories[currentTabId].dishes[index].dishName}
                        onDishNameChange={(event) =>
                          handleDishNameChange(event, index)
                        }
                        dishDescription={
                          categories[currentTabId].dishes[index].dishDescription
                        }
                        onDishDescriptionChange={(event) =>
                          handleDishDescriptionChange(event, index)
                        }
                        onPriceChange={(event) => handlePriceChange(event, index)}
                        dishPrice={
                          categories[currentTabId].dishes[index].dishPrice
                        }
                        onImageChange={(event) => handleDishImageChange(event, index)}></DishCard>
                    );
                  })}
                </div>

              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}</div>

        <div className="px-3 fixed bottom-0 right-0 flex justify-end align-center">
          <button
            ref={saveFormButtonRef}

            className="flex p-2 m-3 justify-center items-center border-2 
          bg-white text-[color:var(--accent2)] hover:scale-110 
          transition"

            onClick={handleFormSave}>
            <h1 className="mx-2 text-2xl font-bold">Save Changes</h1>
            <FontAwesomeIcon icon={faSave} size="2x"></FontAwesomeIcon>
          </button>
          <PreviewButton preview_url={HOST_URL + '/menu/' + menuID}></PreviewButton>
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

  function handleRemoveDishClick(event: MouseEvent, index: number) {
    let newCategories = { ...categories };
    newCategories[currentTabId].dishes.splice(index, 1);
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
