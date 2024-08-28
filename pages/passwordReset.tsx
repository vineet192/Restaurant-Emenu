import { FormEvent, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function PasswordReset() {

    const emailRef = useRef<HTMLInputElement>()
    const { resetPassword } = useAuth()

    return (
        <div className="h-screen flex items-center justify-center">
            <form
                onSubmit={onSubmit}>
                <div className="flex flex-col p-2 bg-[color:var(--background2)] rounded-md">
                    <h1 className="self-center m-2 font-extrabold text-3xl mb-16 text-[color:var(--accent2)]">
                        RESET PASSWORD
                    </h1>
                    <input
                        className="m-4 p-1 outline-none bg-transparent focus:border-[color:var(--accent2)] transition border-b"
                        placeholder="Email"
                        ref={emailRef}></input>

                    <button className="p-2 m-2 bg-[color:var(--accent2)] self-center text-[color:var(--text)] text-xl font-semibold mt-10 flex">
                        Send link
                    </button>
                </div>
            </form>
        </div>
    )

    function onSubmit(event: FormEvent) {
        event.preventDefault()
        resetPassword(emailRef.current.value)
        .then(() => alert(`Password reset link sent to ${emailRef.current.value}`))
        .catch((err: Error) => {
            alert("An unexpected error occured, please try again")
        })
    }
}