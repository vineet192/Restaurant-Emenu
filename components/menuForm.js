import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef, useEffect, useRef, useState } from 'react';
import AddCategoryButton from '../components/buttons/addCategoryButton';
import AddDishButton from './buttons/addDishButton';
import RemoveCategoryButton from './buttons/removeCategoryButton';
import DishCard from './dishCard';
import { useAuth } from '../contexts/AuthContext';
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
  const formRef = useRef();
  const { currentUser } = useAuth();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
  useEffect(async () => {
    //get current menu obj from user
    let menu;
    try {
      let data = await fetch(
        SERVER_URL + '/menu/' + currentUser.uid + '?menuID=' + props.menuID
      );
      menu = (await data.json()).menu;
    } catch (err) {
      console.log(err);
      alert('Something went wrong fetching your details');
      return;
    }

    let newCategories = { ...categories };
    menu.categories.forEach((element, index) => {
      newCategories[index] = element;
    });

    setCategories(newCategories);
  }, []);

  return (
    <form
      className="w-full h-full pt-20"
      ref={formRef}
      onSubmit={(event) => event.preventDefault()}>
      <div className="flex p-5 align-center w-full flex-col">
        <div className="flex justify-center">
          <AddCategoryButton
            icon={faPlus}
            onClick={() => {
              addCategory((numCategories + 1).toString());
              setNumCategories(numCategories + 1);
            }}></AddCategoryButton>
        </div>

        <div className="flex flex-nowrap justify-center align-center p-2 overflow-x-hidden">
          <div className="flex overflow-x-auto">
            {/* List of categories as a horizontally scrollable list */}
            {Object.keys(categories).map((key) => {
              return (
                <div className="p-2 m-2 flex" key={key} id={key}>
                  <input
                    className="m-2 p-2 flex-shrink-0 focus:outline-none shadow-md focus:shadow-lg cursor-pointer"
                    placeholder="Enter a category"
                    value={categories[key].title}
                    onFocus={(event) => {
                      let id = event.currentTarget.parentElement.id;
                      setCurrentTabId(id);
                    }}
                    onChange={(event) => {
                      let category = event.currentTarget.value;
                      let id = event.currentTarget.parentElement.id;

                      let newCategories = { ...categories };
                      newCategories[id].title = category;

                      setCategories(newCategories);
                    }}></input>
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
        <div className="p-2 m-2 flex flex-col w-full overflow-y-auto">
          <h1 className="justify-self-start text-6xl text-red-700 font-extrabold p-2">
            {currentTabId > -1 ? categories[currentTabId].title : ''}
          </h1>
          <hr className="text-red-700"></hr>

          <AddDishButton
            onClick={(event) => {
              addDish({
                dishName: '',
                dishDescription: '',
                dishPrice: '0.0',
              });
            }}></AddDishButton>

          {/* List of Dishes. User can add dish name and description. */}
          {currentTabId > -1 ? (
            <div className="flex flex-col justify-center items-center">
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
      )}

      <div className="px-3 fixed bottom-0 right-0 flex justify-end align-center">
        <button className="block p-2 m-3" onClick={handleFormSave}>
          <FontAwesomeIcon
            icon={faSave}
            size="2x"
            color="blue"></FontAwesomeIcon>
        </button>
      </div>
    </form>
  );

  function addDish(dish) {
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
    let id = event.currentTarget.parentElement.id;
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

  function handleFormSave(event) {
    //Write to db here
    console.log(Object.values(categories));

    let raw = JSON.stringify({ categories: Object.values(categories) });

    let requestOptions = {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: raw,
      redirect: 'follow',
    };

    fetch(
      SERVER_URL + '/menu/' + currentUser.uid + '/' + props.menuID,
      requestOptions
    ).catch((error) => console.log('error', error));
  }

  function handleEditClick(event) {
    setIsEditing(true);
  }
}
