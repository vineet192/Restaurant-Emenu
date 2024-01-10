import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SaveChangesButton(props) {

    return (<button
        // ref={saveFormButtonRef}

        className="flex p-2 m-3 justify-center items-center 
        border-blue-500 bg-white text-blue-500 hover:bg-blue-500 
        hover:text-white transition ease-in-out"

        onClick={props.handleFormSave}>
        <h1 className="mx-2 text-2xl font-bold">Save Changes</h1>
        <FontAwesomeIcon icon={faSave} size="2x"></FontAwesomeIcon>
      </button>)
}