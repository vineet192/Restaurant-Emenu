import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../static/toastConfig';
import { ToastContainer, toast } from 'react-toastify';

export default function signup(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { signup, currentUser } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (currentUser != null) {
      router.push('/')
    }
  }, [currentUser])

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

          {!isLoading &&
            <button className="p-2 m-2 bg-blue-500 self-center text-white text-xl font-semibold mt-10">
              Signup
            </button>}

          {isLoading &&
            <button className="p-2 m-2 bg-blue-500 self-center text-white text-xl font-semibold mt-10 animate-pulse" disabled>
              Signing up
            </button>}

          <span className="self-center m-2">
            Already have an account?{' '}
            <a href="/login" className="underline text-blue-500">
              Login
            </a>
          </span>
        </div>
      </form>
      <ToastContainer />
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
      setIsLoading(true)
      await signup(email, password);
      setIsLoading(false)
    } catch (err) {
      console.log(err);
      setIsLoading(false)
      errorToast("Error signing up")
    }
  }
}
