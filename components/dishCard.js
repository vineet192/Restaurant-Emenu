import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

export default function DishCard(props) {

  const cardRef = useRef()

  useEffect(() => {
    cardRef.current.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => { cardRef.current.style.opacity = 100; }, 150)
  }, [])

  return (
    <div
      ref={cardRef}
      className="flex flex-col border-2 border-gray-400 
      hover:shadow-lg my-2 mr-10 py-2 px-8 w-full 
      transition-opacity opacity-0 relative rounded-xl">
      <div className="flex flex-row items-center max-w-full overflow-x-hidden">
        <label className="text-2xl m-2">Dish Name</label>
        <input
          onChange={props.onDishNameChange}
          value={props.dishName}
          className="p-2 m-2 text-2xl bg-transparent border-b-2 
          border-b-blue-100 outline-none focus:border-b-blue-500 transition"
          placeholder="Enter dish name"></input>
      </div>

      <div className="flex flex-row items-center max-w-full overflow-x-hidden">
        <label className="text-2xl m-2">Price</label>
        <input
          onChange={props.onPriceChange}
          value={props.dishPrice}
          className="p-2 m-2 text-2xl bg-transparent border-b-2 border-b-blue-100 outline-none focus:border-b-blue-500 transition"
          placeholder="Enter price"></input>
      </div>

      <label className="text-2xl mx-2 mt-2">Description : </label>
      <textarea
        onChange={props.onDishDescriptionChange}
        value={props.dishDescription}
        className="m-2 p-2 outline-none border-2 focus:border-blue-500 resize-none rounded-xl transition"
        placeholder="Give it a description"></textarea>

      <button
        className="p-2 mx -2 absolute top-0 right-0 text-red-500"
        onClick={props.onRemove}>
        <FontAwesomeIcon icon={faTrashAlt} size="2x"></FontAwesomeIcon>
      </button>

    </div>
  );
}
