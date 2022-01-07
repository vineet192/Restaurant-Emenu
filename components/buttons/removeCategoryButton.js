import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function removeCategoryButton(props) {
  return (
    <button
      id={props._id}
      className="bg-red-500 text-white p-2 m-2 rounded-full h-10 w-10"
      onClick={props.onClick}>
      <FontAwesomeIcon color="white" icon={faMinus}></FontAwesomeIcon>
    </button>
  );
}
