export default function DishCard(props) {
  return (
    <div className="flex flex-col shadow-md hover:shadow-lg m-2 p-2 w-full">
      <div className="flex">
        <input
          onChange={props.onDishNameChange}
          value={props.dishName}
          className="p-2 m-2 outline-none border-b-2 border-gray-500 text-3xl"
          placeholder="Enter dish name"></input>

        <input
          onChange={props.onPriceChange}
          value={props.dishPrice}
          className="p-2 m-2 outline-none border-b-2 border-gray-500 text-3xl"
          placeholder="Enter price"></input>
      </div>
      <textarea
        onChange={props.onDishDescriptionChange}
        value={props.dishDescription}
        className="m-2 p-2 outline-none border-gray-500 border-2"
        placeholder="Give it a description"></textarea>
      <div className="flex w-full justify-center">
        <button
          className="p-2 m-2 border-gray-500 border"
          onClick={props.onSave}>
          Save
        </button>
        <button
          className="p-2 m-2 border-gray-500 border"
          onClick={props.onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
