import { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/router"
import { errorToast } from "../static/toastConfig"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function Account(props) {

    const { currentUser, deleteAccount } = useAuth()
    const router = useRouter()
    const credentialsViewRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const deletePromptButtonRef = useRef()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log(currentUser)
    }, [])

    useEffect(() => {
        if (!currentUser) {
            router.push("/login")
        }
    }, [currentUser])

    function toggleDeleteConfirmationView(event) {
        passwordRef.current.value = ""
        confirmPasswordRef.current.value = ""
        credentialsViewRef.current.classList.toggle("h-0")
        credentialsViewRef.current.classList.toggle("h-48")
        deletePromptButtonRef.current.classList.toggle("hidden")
    }

    // Deletes account using the deleteAccount method from useAuth
    async function handleDeleteAccount(event) {

        const email = currentUser.email
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value

        // Basic validation
        if (!passwordRef.current.checkValidity() || !confirmPasswordRef.current.checkValidity()) {
            return
        }

        // Equality Validation
        if (password !== confirmPassword) {
            errorToast("Passwords don't match")
            return
        }

        //Attempt deletion
        setIsLoading(true)
        deleteAccount(email, password).then(() =>
            router.push("/login")
                .then(() => setIsLoading(false))
        )
            .catch(err => {
                errorToast("Error deleting account")
                setIsLoading(false)
            })
            .finally(() => setIsLoading(false))
    }

    if (!currentUser) {
        return <></>
    }

    return (
        <div className="h-full flex-auto flex justify-center items-center">

            <div className="mt-3.5 p-5 shadow-lg flex flex-col items-center bg-[color:var(--background2)] rounded-md">
                <h1 className="text-4xl text-[color:var(--accent2)] font-extrabold my-10">
                    Account
                </h1>

                <div className="flex flex-nowrap items-center my-2 w-full pr-2 border ">
                    <label htmlFor="name" className="mr-10 bg-gray-200 p-3 ">Name</label>
                    <p name="name" className="ml-auto">{currentUser.displayName}</p>
                </div>

                <div className="flex flex-nowrap items-center my-2 border pr-2">
                    <label htmlFor="email" className="mr-10 bg-gray-200 p-3 ">Email</label>
                    <p name="email" className="ml-auto">{currentUser.email}</p>
                </div>

                <form ref={credentialsViewRef} className="flex flex-col h-0 overflow-hidden transtion-[height] duration-200" onSubmit={event => event.preventDefault()}>

                    {/* password and confirm password */}
                    <input
                        className="m-4 p-1 outline-none bg-transparent focus:border-[color:var(--accent2)] transition border-b"
                        placeholder="Password"
                        ref={passwordRef}
                        type="password"
                        required>
                    </input>
                    <input
                        className="m-4 p-1 outline-none bg-transparent focus:border-[color:var(--accent2)] transition border-b"
                        placeholder="Confirm password"
                        ref={confirmPasswordRef}
                        type="password"
                        required>
                    </input>

                    {/* Loading Spinner */}
                    {isLoading &&
                        <button
                            className="m-2 bg-red-500 text-white hover:bg-red-600 rounded-lg p-2 shadow-md font-bold animate-pulse"
                            disabled>
                            Working on it
                        </button>
                    }

                    {/* Main Delete account button and cancel button */}
                    {!isLoading &&

                        <div>
                            <button
                                onClick={handleDeleteAccount}
                                className="m-2 bg-red-500 text-white hover:bg-red-600 rounded-lg p-2 shadow-md font-bold">
                                Confirm Deletion
                            </button>
                            <button
                                onClick={toggleDeleteConfirmationView}
                                className="m-2 rounded-lg shadow-md font-bold p-2 bg-gray-100 hover:bg-gray-200"
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    }
                </form>

                {/* Button to prompt account deletion */}
                <button onClick={toggleDeleteConfirmationView} ref={deletePromptButtonRef}
                    className="m-2 bg-red-500 text-white hover:bg-red-600 rounded-lg p-2 shadow-md font-bold">
                    Delete Account
                </button>
            </div>
            <ToastContainer />
        </div>
    )
}