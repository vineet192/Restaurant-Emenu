import Router from 'next/router';

export default function ProfileCard(props) {
  return (
    <div className="h-full flex-auto flex justify-center items-center">
      <div className="m-2 p-5 shadow-lg flex flex-col items-center">
        <h1 className="text-4xl text-blue-500 font-extrabold my-5">
          DASHBOARD
        </h1>
        <ul>
          <li className="mx-2 my-4">
            <h1 className="text-2xl">You can find your E-menu here</h1>
          </li>
          <li className="mx-2 my-4">
            <div className="border border-gray-400 p-2 flex justify-center items-center">
              <a href="http://www.example.com">http://www.example.com</a>{' '}
              <button
                className="bg-blue-500 text-white rounded p-2 mx-2"
                onClick={emenuRedirect}>
                Customize
              </button>
            </div>
          </li>
          <hr />
          <li className="mx-2 my-4">
            <label htmlFor="public" className="mx-2">
              Make your E-menu public?
            </label>
            <input
              type={'checkbox'}
              className="text-blue-500"
              id="public"></input>
          </li>
        </ul>
      </div>
    </div>
  );

  function emenuRedirect() {
    Router.push('/menu');
  }
}
