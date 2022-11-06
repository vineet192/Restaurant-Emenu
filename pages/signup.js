import { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function signup(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup } = useAuth();
  const router = useRouter()

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col shadow-lg p-2">
          <h1 className="self-center m-2 font-extrabold text-3xl mb-16">
            SIGN UP
          </h1>
          <input
            className="m-4 p-1 outline-none border-gray-500 border-b"
            placeholder="Email"
            ref={emailRef}></input>
          <input
            className="m-4 p-2 outline-none border-gray-500 border-b"
            placeholder="Password"
            type="password"
            ref={passwordRef}></input>
          <input
            className="m-4 p-2 outline-none border-gray-500 border-b"
            placeholder="Confirm Password"
            type="password"
            ref={confirmPasswordRef}></input>
          <button className="p-2 m-2 bg-blue-500 self-center text-white text-xl font-semibold mt-10">
            Signup
          </button>
          <span className="self-center m-2">
            Already have an account?{' '}
            <a href="/login" className="underline text-blue-500">
              Login
            </a>
          </span>
        </div>
      </form>
    </div>
  );

  async function onSubmit(event) {
    event.preventDefault();

    let email = emailRef.current.value;
    let password = passwordRef.current.value;
    let confirmPassword = confirmPasswordRef.current.value;

    if (password != confirmPassword) {
      console.log('confirm pwd error');
      return;
    }

    try {
      await signup(email, password);
      router.push('/')
    } catch (err) {
      console.log(err);
    }
  }
}
