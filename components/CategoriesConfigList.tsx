import React from "react";
import AddCategoryButton from "./buttons/addCategoryButton";
import CategoryNameInput from "./input/categoryNameInput";
import RemoveCategoryButton from "./buttons/removeCategoryButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export function CategoriesConfigList({
    addCategory,
    setNumCategories,
    numCategories,
    handleCategoryNameChange,
    handleCategorySelect,
    handleRemoveCategoryClick,
    categories
}) {
    return <div className="flex p-10 align-center flex-col rounded-xl ml-5 mb-5 mr-10 lg:w-2/5 sm:w-full max-h-[500px] overflow-y-auto">
        <div className="flex justify-center">
            <AddCategoryButton icon={faPlus} onClick={() => {
                addCategory((numCategories + 1).toString());
                setNumCategories(numCategories + 1);
            }}></AddCategoryButton>
        </div>

        <div className="flex flex-nowrap justify-center align-center p-2 overflow-x-hidden">
            <div className="flex flex-row overflow-auto lg:flex-col sm:flex-row">
                {
                    /* List of categories as a horizontally scrollable list */
                }
                {Object.keys(categories).map(key => {
                    return <div className="p-2 m-2 flex" key={key} id={key}>
                        <CategoryNameInput onChange={handleCategoryNameChange} onFocus={handleCategorySelect} value={categories[key].title}></CategoryNameInput>
                        <RemoveCategoryButton _id={key} onClick={handleRemoveCategoryClick}></RemoveCategoryButton>
                    </div>;
                })}
            </div>
        </div>
    </div>;
}
