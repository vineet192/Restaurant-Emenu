import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export function SaveChangesButton({
    saveFormButtonRef,
    handleFormSave,
    faSave
}) {
    return <button ref={saveFormButtonRef} className="flex p-2 m-3 justify-center items-center border-2 
          bg-white text-[color:var(--accent2)] hover:scale-110 
          transition" onClick={handleFormSave}>
        <h1 className="mx-2 text-2xl font-bold">Save Changes</h1>
        <FontAwesomeIcon icon={faSave} size="2x"></FontAwesomeIcon>
    </button>;
}
