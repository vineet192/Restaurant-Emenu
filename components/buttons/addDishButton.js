import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AddDishButton(props) {
  return (
    <button
      className="p-2 m-2 self-center flex items-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md text-white"
      onClick={props.onClick}>
      <FontAwesomeIcon
        icon={faPlus}
        size="lg"
        className="mr-2"></FontAwesomeIcon>
      Add Dish
    </button>
  );
}
