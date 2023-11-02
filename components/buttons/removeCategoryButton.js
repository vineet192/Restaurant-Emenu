import {faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function removeCategoryButton(props) {
  return (
    <button
      id={props._id}
      className="bg-red-700 text-white p-2 ml-1 my-2 rounded-full h-10 w-10 hover:bg-red-500 transition"
      onClick={props.onClick}>
      <FontAwesomeIcon color="white" icon={faTimes} size='lg'></FontAwesomeIcon>
    </button>
  );
}
