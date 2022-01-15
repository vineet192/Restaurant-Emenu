import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef, useEffect, useState } from 'react';
import AddCategoryButton from '../components/buttons/addCategoryButton';
import AddDishButton from './buttons/addDishButton';
import RemoveCategoryButton from './buttons/removeCategoryButton';
import DishCard from './dishCard';

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
  const [isEditing, setIsEditing] = useState(true);
  const [numCategories, setNumCategories] = useState(0);
  const [currentTabId, setCurrentTabId] = useState(-1); //Current category of dish selected by user (in focus)

  const saveButton = (
    <FontAwesomeIcon icon={faSave} size="2x" color="blue"></FontAwesomeIcon>
  );

  const editButton = (
    <FontAwesomeIcon icon={faEdit} size="2x" color="blue"></FontAwesomeIcon>
  );

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  useEffect(() => {
    console.log(currentTabId);
  }, [currentTabId]);

  return (
    <div className="w-full h-full">
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
            {/* List of caegtegories as a horizontally scrollable list */}
            {Object.keys(categories).map((key) => {
              return (
                <div className="p-2 m-2 flex" key={key} id={key}>
                  <input
                    className="m-2 p-2 flex-shrink-0 focus:outline-none shadow-md focus:shadow-lg cursor-pointer"
                    disabled={!isEditing}
                    placeholder="Enter a category"
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
                    onClick={removeCategory}></RemoveCategoryButton>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {currentTabId != -1 ? (
        <div className="p-2 m-2 flex flex-col w-full overflow-y-auto">
          <h1 className="justify-self-start text-6xl text-red-700 font-extrabold">
            {currentTabId > -1 ? categories[currentTabId].title : ''}
          </h1>
          <hr className="text-red-700"></hr>

          <AddDishButton
            onClick={(event) => {
              addDish({
                dishName: '',
                dishDescription: '',
              });
            }}></AddDishButton>

          {/* List of Dishes. User can add dish name and description. */}
          {currentTabId > -1 ? (
            <div className="flex flex-col justify-center items-center">
              {categories[currentTabId].dishes.map((dish, index) => {
                return (
                  <DishCard
                    key={index}
                    onRemove={(event) => {
                      let newCategories = { ...categories };
                      newCategories[currentTabId].dishes.splice(index, 1);
                      setCategories(newCategories);
                    }}
                    dishName={categories[currentTabId].dishes[index].dishName}
                    onDishNameChange={(event) => {
                      //update the dish name
                      let newCategories = { ...categories };
                      newCategories[currentTabId].dishes[index].dishName =
                        event.currentTarget.value;
                      setCategories(newCategories);
                    }}
                    dishDescription={
                      categories[currentTabId].dishes[index].dishDescription
                    }
                    onDishDescriptionChange={(event) => {
                      //update the dish description
                      let newCategories = { ...categories };
                      newCategories[currentTabId].dishes[
                        index
                      ].dishDescription = event.currentTarget.value;
                      setCategories(newCategories);
                    }}></DishCard>
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
        <button className="block p-2 m-3">
          {isEditing ? saveButton : editButton}
        </button>
      </div>
    </div>
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

  function removeCategory(event) {
    let id = event.currentTarget.parentElement.id;
    let newCategories = { ...categories };
    setCurrentTabId(-1);
    delete newCategories[id];

    setCategories(newCategories);
  }
}
