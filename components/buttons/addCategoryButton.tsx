import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

type AddCategoryButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
  icon: IconProp
}

export default function AddCategoryButton(props: AddCategoryButtonProps) {
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
