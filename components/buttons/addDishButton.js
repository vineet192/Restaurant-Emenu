import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AddDishButton(props) {
  return (
    <button
      className="p-2 m-2 self-center flex items-center text-[color:var(--accent1)]"
      onClick={props.onClick}>
      <FontAwesomeIcon
        icon={faPlus}
        size="lg"
        className="mr-2"></FontAwesomeIcon>
      Add Dish
    </button>
  );
}
