import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
          <button className="p-2 m-2 bg-blue-500 self-center text-white text-xl font-semibold mt-10">
            Login
          </button>
          <span className="self-center m-2">
            Don't have an account?{' '}
            <a href="/signup" className="underline text-blue-500">
              Signup
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

    try {
      setIsLoading(true);
      await login(email, password);
      setIsLoading(false);

      router.push('/')
    } catch (err) {
      console.log(err);
    }
  }
}
