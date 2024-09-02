import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEventHandler, MouseEventHandler, useEffect, useRef } from "react";

type DishCardProps = {
  onDishNameChange: ChangeEventHandler<HTMLInputElement>,
  onPriceChange: ChangeEventHandler<HTMLInputElement>,
  onDishDescriptionChange: ChangeEventHandler<HTMLTextAreaElement>,
  onRemove: MouseEventHandler<HTMLButtonElement>
  onImageChange: (event) => void
  dishName: string,
  dishPrice: string,
  dishDescription: string,
}

export default function DishCard(props: DishCardProps) {

  const cardRef = useRef<HTMLDivElement>()

  useEffect(() => {
    cardRef.current.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => { cardRef.current.style.opacity = "100"; }, 150)
  }, [])

  return (
    <div
      ref={cardRef}
      className="flex flex-col border border-[color:var(--accent1)] my-2 mr-10 py-2 px-8 w-full 
      transition-opacity opacity-0 relative rounded-xl">
      <div className="flex flex-row items-center max-w-full overflow-x-hidden text-[color:var(--text)]">
        <label className="text-2xl m-2">Dish Name</label>
        <input
          onChange={props.onDishNameChange}
          value={props.dishName}
          className="p-2 m-2 text-2xl bg-transparent border-b-2 
          border-b-blue-100 outline-none focus:border-b-[color:var(--accent1)] transition"
          placeholder="Enter dish name"></input>
      </div>

      <div className="flex flex-row items-center max-w-full overflow-x-hidden text-[color:var(--text)]  ">
        <label className="text-2xl m-2">Price</label>
        <input
          onChange={props.onPriceChange}
          value={props.dishPrice}
          className="p-2 m-2 text-2xl bg-transparent border-b-2 border-b-blue-100 outline-none 
          focus:border-b-[color:var(--accent1)] transition"
          placeholder="Enter price"></input>
      </div>

      <label className="text-2xl mx-2 mt-2 text-[color:var(--text)]">Description : </label>
      <textarea
        onChange={props.onDishDescriptionChange}
        value={props.dishDescription}
        className="m-2 p-2 outline-none border-2 focus:border-[color:var(--accent1)] resize-none rounded-xl transition"
        placeholder="Give it a description"></textarea>

      <button
        className="p-2 mx -2 absolute top-0 right-0 text-red-500"
        onClick={props.onRemove}>
        <FontAwesomeIcon icon={faTrashAlt} size="2x"></FontAwesomeIcon>
      </button>

    </div>
  );
}
