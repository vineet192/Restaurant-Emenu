import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

type AddDishButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
}

export default function AddDishButton(props: AddDishButtonProps) {
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
