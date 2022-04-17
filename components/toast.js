import { useEffect, useRef } from 'react';

export default function Toast(props) {
  let hidden = false;
  let successRef = useRef();
  let failureRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (successRef.current) {
        successRef.current.classList.toggle('hidden');
        return;
      }
      failureRef.current.classList.toggle('hidden');
    }, 1000);
  }, []);

  if (props.isSuccess) {
    return (
      <div
        className="bg-green-600 rounded-md p-3 m-2 fixed top-0 right-50"
        ref={successRef}>
        <h1>{props.msg}</h1>
      </div>
    );
  }

  return (
    <div
      className="bg-red-500 rounded-md p-5 m-2 fixed bottom-0 right-0"
      ref={failureRef}>
      <h1>{props.msg}</h1>
    </div>
  );
}
