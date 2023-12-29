import { faFilter, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import MenuCard from "./menuCard";
import { errorToast, successToast} from '../static/toastConfig';

export default function PaginatedMenus(props) {

    const { currentUser } = useAuth()
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER
    const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME
    const [eMenus, setEmenus] = useState([]);
    const addMenuFormRef = useRef()
    const addMenuFormBtn = useRef()

    useEffect(async () => {
        initMenus()
    }, []);


    return (
        <div className="flex flex-col w-full mx-auto p-2 mt-5">
            {/* Search bar, number of items and filter */}
            <div className="flex w-full justify-start border-b-2 border-blue-300 px-9 py-2">
                <div className="ml-2 mr-5 my-auto">
                    <input placeholder="search" className="bg-transparent border-b focus:border-blue-500 transition"></input>
                    <button><FontAwesomeIcon icon={faFilter} className="text-blue-500"></FontAwesomeIcon></button>
                </div>
                <p>Showing 10 of 36 items</p>
            </div>


            {/* Add menu form */}
            <form
                ref={addMenuFormRef}
                onTransitionEnd={clearFormInput}
                onSubmit={addNewMenu}
                className="mx-auto w-fit flex flex-col max-h-0 
                transition-[max-height] duration-300 overflow-hidden mt-4 bg-blue-500 rounded-lg">
                <input
                    required
                    placeholder="Restaurant name"
                    className="mx-10 text-3xl font-bold bg-transparent 
                border-b border-white text-white m-5 text-center"></input>
                <div className="w-full flex justify-center">
                    <button
                        className="border text-white font-bold hover:bg-white hover:text-blue-500 
                    transition m-2 p-2 w-fit rounded-md">
                        <FontAwesomeIcon icon={faPlus} className="mx-2"></FontAwesomeIcon>
                        Add
                    </button>
                    <button
                        onClick={toggleNewMenuForm}
                        type="button"
                        className="border text-white font-bold hover:bg-white hover:text-blue-500 
                    transition m-2 p-2 w-fit rounded-md">
                        <FontAwesomeIcon icon={faTimes} className="mx-2"></FontAwesomeIcon>
                        Cancel
                    </button>
                </div>
            </form>

            <button
                ref={addMenuFormBtn}
                onClick={toggleNewMenuForm}
                className="border bg-blue-500 text-white font-bold hover:bg-blue-600 transition-[width] mx-auto my-2 p-2 w-fit rounded-md">
                <FontAwesomeIcon icon={faPlus} className="mx-2"></FontAwesomeIcon>
                Add Restaurant
            </button>

            {/* List of menus */}
            <div className="mx-auto w-4/5 flex flex-col p-2">
                {eMenus.map((menu, index) =>
                    <MenuCard
                        url={`${HOST_URL}/menu/${menu._id}`}
                        name={menu.name}
                        key={menu._id}
                        id={menu._id}
                        onMenuDelete={refreshMenus}>
                    </MenuCard>
                )}
            </div>

        </div>
    )

    async function initMenus() {
        let userMenus = await getUserMenuObj(currentUser.uid);
        let newMenus = [...eMenus];
        newMenus = userMenus;
        setEmenus(newMenus);
    }

    async function refreshMenus() {
        let userMenus = await getUserMenuObj(currentUser.uid);
        setEmenus(userMenus)
    }

    async function getUserMenuObj(uid) {
        let menus = (await (await fetch(SERVER_URL + `/menu/?uid=${uid}`)).json()).menus;
        return menus;
    }

    function toggleNewMenuForm(event) {
        addMenuFormBtn.current.classList.toggle("hidden")
        addMenuFormRef.current.classList.toggle("max-h-0")
        addMenuFormRef.current.classList.toggle("max-h-96")
    }

    function addNewMenu(event) {
        event.preventDefault()
        saveMenuForUser()
        toggleNewMenuForm()
    }

    function clearFormInput(event) {

        if (event.target !== addMenuFormRef.current) {
            return
        }

        event.currentTarget.querySelector("input").value = ""
    }

    async function saveMenuForUser() {
        let menuName = addMenuFormRef.current.children[0].value;
        let currency = 'INR';

        let payload = {
            menuName: menuName,
            currency: currency,
            uid: currentUser.uid,
        };

        let res = await fetch(SERVER_URL + '/menu/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (res.status != 201) {
            errorToast("Error saving menu")
            return;
        }

        refreshMenus()
        successToast("Menu saved successfully")
    }
}