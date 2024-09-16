import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export function CategoriesPreview({
    categoriesPopup,
    categories,
    scrollToCategoryAndOpen,
    handleCloseCategories,
}) {
    return (
        <div className="hidden z-10 flex-col max-h-96 overflow-y-scroll items-center bg-[color:var(--background2)] 
        rounded-lg text-[color:var(--accent2)] fixed bottom-0 right-0 p-2 m-5"
            ref={categoriesPopup}>
            <h2 className="text-2xl font-extrabold">Categories</h2>
            <ul className="mt-5">
                {categories && categories.map((category, index) => <li key={index} className="my-2">
                    <h2 className="text-2xl cursor-pointer" onClick={() => {
                        scrollToCategoryAndOpen(index);
                    }}>
                        {category.title}
                    </h2>
                </li>)}
            </ul>
            <button className="sticky bottom-0 w-fit left-full p-1" onClick={handleCloseCategories}>
                <FontAwesomeIcon icon={faBackspace}></FontAwesomeIcon>
            </button>
        </div>
    )
}
