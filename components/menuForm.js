import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import AddCategoryButton from '../components/buttons/addCategoryButton';
import AddDishButton from './buttons/addDishButton';
import RemoveCategoryButton from './buttons/removeCategoryButton';
import DishCard from './dishCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import { errorToast, successToast } from '../static/toastConfig';
import { useRouter } from 'next/router';
import PreviewButton from './buttons/previewButton';
import CategoryNameInput from './input/categoryNameInput';
/*
Structure of categories state:

{
  "categoryId": {
    "title": "categoryTitle",
    "dishes": [
      {
        "dishName" : "name",
        "dishDescription": "description"
        "price": "price"
      }
    ]
  }
}
*/

export default function MenuForm(props) {
  const [categories, setCategories] = useState({}); //structure shown above.
  const [numCategories, setNumCategories] = useState(0);
  const [currentTabId, setCurrentTabId] = useState(-1); //Current category of dish selected by user (in focus)
  const [menuName, setMenuName] = useState('');
  const formRef = useRef();
  const { currentUser } = useAuth();
  const categoriesDiv = useRef();
  const saveFormButtonRef = useRef();
  const editMenuNameFieldRef = useRef();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;
  const router = useRouter()

  useEffect(async () => {
    //get current menu obj from user
    let menu;
    try {
      let data = await fetch(SERVER_URL + `/menu/?menuID=${props.menuID}`);
      menu = (await data.json()).menu;
    } catch (err) {
      console.log(err);
      alert('Something went wrong fetching your details');
      return;
    }

    setMenuName(menu.name);

    let newCategories = { ...categories };
    menu.categories.forEach((element, index) => {
      newCategories[index] = element;
    });

    if(Object.keys(newCategories).length == 0){
      newCategories[0] = {"dishes": [], "title": "Appetizers"}
    }

    setCategories(newCategories);
    setNumCategories(menu.categories.length);
  }, []);

  return (
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
            className="text-6xl m-2 font-bold text-blue-500 border-b-2 border-transparent transition bg-transparent text-center w-auto focus:border-blue-500"
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
              className="text-blue-500"
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
            <h1 className=" text-4xl text-red-700 font-extrabold p-2 w-full">
              {currentTabId > -1 ? categories[currentTabId].title : ''}
            </h1>
            <hr className="text-red-700"></hr>

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
                      }></DishCard>
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

          className="flex p-2 m-3 justify-center items-center rounded-lg border-2 
          border-blue-500 bg-white text-blue-500 hover:bg-blue-500 
          hover:text-white transition ease-in-out"

          onClick={handleFormSave}>
          <h1 className="mx-2 text-2xl font-bold">Save Changes</h1>
          <FontAwesomeIcon icon={faSave} size="2x"></FontAwesomeIcon>
        </button>
        <PreviewButton preview_url={HOST_URL + '/menu/' + props.menuID}></PreviewButton>
      </div>
      <ToastContainer />
    </form>
  );

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

    if(Object.keys(categories).length <= 1){
      alert("You must have at least one category!")
      return
    }

    let id = event.currentTarget.parentElement.id;

    let categoryInput = event.currentTarget.parentElement.querySelector("input")

    categoryInput.style.width= 0

    let newCategories = { ...categories };
    setCurrentTabId(-1);
    delete newCategories[id];

    setCategories(newCategories);
  }

  function handleRemoveDishClick(event, index) {
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

  async function handleFormSave(event) {
    //Write to db here

    let menuEdits = { categories: Object.values(categories), name: menuName };

    let payload = {
      menuID: props.menuID,
      newMenu: menuEdits,
    };

    let requestOptions = {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    };

    let res;
    try {
      saveFormButtonRef.current.classList.toggle('animate-pulse');
      res = await fetch(SERVER_URL + '/menu/', requestOptions);
      saveFormButtonRef.current.classList.toggle('animate-pulse');
    } catch (err) {
      errorToast('Error saving menu');
    }

    if (res.status != 204) {
      errorToast('Error saving menu');
    }
    successToast('menu saved successfully!');
  }
}
