import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export function EditMenuNameToggle({
    toggleMenuNameEdit,
    faEdit
}) {
    return <button onClick={toggleMenuNameEdit}>
        <FontAwesomeIcon icon={faEdit} size="2x" className="text-[color:var(--text)]" />
    </button>;
}
