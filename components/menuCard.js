import { faDownload, faEdit, faEllipsisV, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { useRouter } from "next/router";
import { errorToast, successToast } from "../static/toastConfig";

export default function MenuCard(props) {

    const optionsDropDownRef = useRef()
    const optionsButtonRef = useRef()
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER
    const cardRef = useRef()

    const router = useRouter()

    useEffect(() => {
        window.addEventListener("click", handleClickOutsideDropDown)

        return () => window.removeEventListener("click", handleClickOutsideDropDown)
    }, [])

    return (
        <div ref={cardRef}
            className="py-2 px-20 my-2 mx-auto flex justify-start w-full shadow-md items-center border-2 rounded-lg border-blue-200 relative transition-transform">

            {/* Options dropdown */}
            <div className="top-1 right-0 absolute flex p-2">
                <ul className="scale-y-0 transition-transform self-end border py-1 z-10 bg-white mr-2 rounded-lg" ref={optionsDropDownRef}>

                    <Link href={`/menu-config/${props.id}`}>
                        <li className="transition hover:bg-gray-100 w-full cursor-pointer px-4 pt-1 text-xl my-2">
                            <FontAwesomeIcon icon={faEdit} className="mx-2"></FontAwesomeIcon>Edit
                        </li>
                    </Link>

                    <Link href={{
                        pathname: '/qr',
                        query: { url: props.url }
                    }}>
                        <li className="transition hover:bg-gray-100 w-full cursor-pointer px-4 pt-1 text-xl my-2">
                            <FontAwesomeIcon icon={faDownload} className="mx-2"></FontAwesomeIcon>QR
                        </li></Link>

                    <li className="transition hover:bg-gray-100 w-full cursor-pointer px-4 pt-1 text-xl my-2"
                        onClick={deleteMenu}>
                        <FontAwesomeIcon icon={faTrash} className="mx-2"></FontAwesomeIcon>Delete</li>
                </ul>
                <button onClick={toggleOptionsExpansion} ref={optionsButtonRef} className="self-start m-2">
                    <FontAwesomeIcon icon={faEllipsisV} size="lg"></FontAwesomeIcon>
                </button>
            </div>

            <a href={props.url}><h1 className="text-blue-500 text-xl lg:text-4xl font-bold underline">{props.name}</h1></a>
            <div className="ml-auto relative p-2">
                <div className="absolute top-1/2 left-1/2 
                            translate-y-[-50%] translate-x-[-50%] h-full w-full opacity-0 
                            hover:opacity-75 hover:bg-blue-500 flex justify-center 
                            items-center rounded-lg duration-300 cursor-pointer"

                    onClick={() => navigator.share({ title: "Menu link", url: props.url })}>
                    <FontAwesomeIcon icon={faShare} size="3x" color="white"></FontAwesomeIcon>
                </div>
                <div className="lg:w-36 w-12 ml-2 h-fit">
                    <QRCode value={props.url} className="h-full w-full"></QRCode>
                </div>
            </div>
        </div>
    )

    function closeCardAnimation() {
        cardRef.current.addEventListener("transitionend", (event) => {props.onMenuDelete()})
        cardRef.current.classList.add("scale-x-0")
    }

    function handleClickOutsideDropDown(event) {

        if (!optionsDropDownRef.current.contains(event.target) && !optionsButtonRef.current.contains(event.target)) {
            closeOptionsDropDown()
        }
    }

    function closeOptionsDropDown() {
        if (!optionsDropDownRef.current.classList.contains("scale-y-0")) {
            optionsDropDownRef.current.classList.add("scale-y-0")
        }
        optionsDropDownRef.current.classList.remove("scale-y-100")
    }

    function toggleOptionsExpansion(event) {
        optionsDropDownRef.current.classList.toggle("scale-y-0")
        optionsDropDownRef.current.classList.toggle("scale-y-100")
    }

    async function deleteMenu() {

        closeOptionsDropDown()

        let url = SERVER_URL + `/menu/`
        let res;

        let payload = {
            id: props.id
        }

        try {
            res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            errorToast(`Error deleting ${props.name}`)
            return
        }

        if (res.status != 200) {
            errorToast(`Error deleting ${props.name}`)
            return
        }

        successToast(`Deleted ${props.name} successfully`)
        closeCardAnimation()
    }
}