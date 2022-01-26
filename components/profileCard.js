export default function ProfileCard(props) {
  return (
    <div className="h-full flex-auto flex justify-center items-center">
      <div className="m-2 p-5 shadow-md flex flex-col items-center">
        <h1 className="text-3xl">PROFILE</h1>
        <ul>
          <li>Customize my menu</li>
          <li>
            Link : http://example.com{' '}
            <input type={'checkbox'} id="is-public"></input>
            <label htmlFor="is-public">Make public?</label>
          </li>
        </ul>
      </div>
    </div>
  );
}
