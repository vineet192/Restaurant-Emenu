import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/router"

export default function CodeVerify() {

    const { currentUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (currentUser && currentUser.emailVerified) {
            router.push("/")
        }
    }, [currentUser])

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col shadow-lg p-5">
                <div className="flex flex-col items-center text-[color:var(--text)]">
                    <h1 className="self-center m-2 font-extrabold text-3xl mb-5">
                        Verify Email
                    </h1>
                    <p>A verification link was sent to <u>{router.query.email}</u></p>
                </div>

            </div>
        </div>
    )
}