export default function DishCard(props) {
  return (
    <div className="flex flex-col justify-between border-2 rounded-3xl border-gray-400 hover:shadow-lg m-2 py-2 px-8 w-4/5">
      <div className="flex flex-col justify-center">
        <label className="text-2xl">Dish Name : </label>
        <input
          onChange={props.onDishNameChange}
          value={props.dishName}
          className="p-2 m-2 outline-none border-2 text-3xl focus:border-blue-500 transition"
          placeholder="Enter dish name"></input>
      </div>

      <div className="flex flex-col justify-center">
        <label className="text-2xl">Price : </label>
        <input
          onChange={props.onPriceChange}
          value={props.dishPrice}
          className="p-2 m-2 outline-none border-2 border-gray-500 text-2xl"
          placeholder="Enter price"></input>
      </div>

      <textarea
        onChange={props.onDishDescriptionChange}
        value={props.dishDescription}
        className="m-2 p-2 outline-none resize-none rounded-lg"
        placeholder="Give it a description"></textarea>
      <div className="flex flex-col w-full justify-center items-center">
        <button
          className="p-2 m-2 border-gray-500 border bg-red-500 rounded-lg text-white"
          onClick={props.onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
