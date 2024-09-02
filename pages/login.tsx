import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../static/toastConfig';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Login() {
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser, anonymousLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (!router.query.err) {
      return
    }

    if (router.query.err === "unverified") {
      errorToast("Please verify your email")
    }
  }, [])

  useEffect(() => {
    if (currentUser != null && currentUser.emailVerified) {
      router.push('/')
    }
  }, [currentUser])

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmit}>
        <div className="flex flex-col p-2 bg-[color:var(--background2)] rounded-md">
          <h1 className="self-center m-2 font-extrabold text-3xl mb-16 text-[color:var(--accent2)]">
            LOGIN
          </h1>
          <input
            className="m-4 p-1 outline-none bg-transparent focus:border-[color:var(--accent2)] transition border-b"
            placeholder="Email"
            ref={emailRef}></input>
          <input
            className="m-4 p-1 outline-none bg-transparent focus:border-[color:var(--accent2)] transition border-b"
            placeholder="Password"
            type="password"
            ref={passwordRef}></input>

          {!isLoading &&
            <div className='flex justify-center'>
              <button className="p-2 m-2 bg-[color:var(--accent2)] self-center text-[color:var(--text)] text-xl font-semibold mt-10 flex">
                Login
              </button>
              <button
                type='button'
                onClick={guestLogin}
                className="p-2 m-2 border border-[color:var(--accent2)] flex items-center bg-[color:var(--background2)] self-center text-[color:var(--accent2)] text-xl font-semibold mt-10">
                <p className='mx-2'>Guest</p>
                <FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon>
              </button>
            </div>}

          {isLoading && <button className="p-2 m-2 bg-[color:var(--accent2)] self-center text-[color:var(--text)] text-xl font-semibold mt-10 flex animate-pulse" disabled>
            Logging in
          </button>}

          <Link href='/passwordReset'>
            <a className='text-sm text-blue-500 underline mx-auto'>Forgot password?</a>
          </Link>

          <span className="self-center m-2">
            Don't have an account?{" "}
            <Link href="/signup" className="underline text-blue-500">
              <a className="underline text-blue-500">Signup</a>
            </Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );


  async function guestLogin(event: any) {
    try {
      setIsLoading(true)
      await anonymousLogin()

      router.push("/").then(() => setIsLoading(false))
    }
    catch (err) {
      console.log(err)
      setIsLoading(false)
      errorToast("Error Logging in")
    }
  }

  async function onSubmit(event: any) {
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
