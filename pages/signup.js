import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../static/toastConfig';
import { ToastContainer, toast } from 'react-toastify';

export default function signup(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef()
  const lastNameRef = useRef()
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
          <div className='flex'>
            <input
              className="m-4 p-1 outline-none bg-transparent focus:border-blue-500 transition border-b"
              placeholder="First name"
              required
              ref={firstNameRef}></input>
            <input
              className="m-4 p-1 outline-none bg-transparent focus:border-blue-500 transition border-b"
              placeholder="Last name"
              required
              ref={lastNameRef}></input>
          </div>
          <input
            className="m-4 p-1 outline-none bg-transparent focus:border-blue-500 transition border-b"
            placeholder="Email"
            required
            ref={emailRef}></input>
          <input
            className="m-4 p-2 outline-none bg-transparent focus:border-blue-500 transition border-b"
            placeholder="Password"
            type="password"
            required
            ref={passwordRef}></input>
          <input
            className="m-4 p-2 outline-none bg-transparent focus:border-blue-500 transition border-b"
            placeholder="Confirm Password"
            type="password"
            required
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
    let firstName = firstNameRef.current.value
    let lastName = lastNameRef.current.value

    if (password != confirmPassword) {
      console.log('confirm pwd error');
      return;
    }

    try {
      setIsLoading(true)
      await signup(email, password, firstName, lastName );
      router.push('/').then(() => setIsLoading(false))
        .catch(err => {
          setIsLoading(false)
          errorToast("Error signing up")
        })
    } catch (err) {
      console.log(err);
      setIsLoading(false)
      errorToast("Error signing up")
    }
  }
}
