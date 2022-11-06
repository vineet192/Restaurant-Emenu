import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AddCategoryButton(props) {
  return (
    <button
      className="p-2 flex items-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md text-white"
      onClick={props.onClick}>
      <FontAwesomeIcon
        icon={props.icon}
        size="lg"
        className="mr-2"></FontAwesomeIcon>
      Add Category
    </button>
  );
}
