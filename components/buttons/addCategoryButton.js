import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AddCategoryButton(props) {
  return (
    <button
      className="p-2 flex items-center rounded-md text-[color:var(--accent1)]"
      onClick={props.onClick}>
      <FontAwesomeIcon
        icon={props.icon}
        size="lg"
        className="mr-2"></FontAwesomeIcon>
      Add Category
    </button>
  );
}
