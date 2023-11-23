import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../static/toastConfig';
import { ToastContainer, toast } from 'react-toastify';

export default function login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    if(currentUser!= null){
      router.push('/')
    }
  }, [currentUser])

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmit}>
        <div className="flex flex-col shadow-lg p-2">
          <h1 className="self-center m-2 font-extrabold text-3xl mb-16">
            LOGIN
          </h1>
          <input
            className="m-4 p-1 outline-none border-gray-500 border-b"
            placeholder="Email"
            ref={emailRef}></input>
          <input
            className="m-4 p-1 outline-none border-gray-500 border-b"
            placeholder="Password"
            type="password"
            ref={passwordRef}></input>

          {!isLoading && <button className="p-2 m-2 bg-blue-500 self-center text-white text-xl font-semibold mt-10 flex">
            Login
          </button>}

          {isLoading && <button className="p-2 m-2 bg-blue-500 self-center text-white text-xl font-semibold mt-10 flex animate-pulse" disabled>
            Logging in
          </button>}


          <span className="self-center m-2">
            Don't have an account?{' '}
            <a href="/signup" className="underline text-blue-500">
              Signup
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

    try {
      setIsLoading(true);
      await login(email, password);

      router.push('/').then(() => {
        setIsLoading(false)
      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      errorToast("Error logging in")
    }
  }
}
