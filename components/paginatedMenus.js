import { faFilter, faPlus, faSearch, faTimes, faUserTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import MenuCard from "./menuCard";
import { errorToast, successToast } from '../static/toastConfig';

export default function PaginatedMenus(props) {

    const { currentUser } = useAuth()
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER
    const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME
    const [eMenus, setEmenus] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false)
    const addMenuFormRef = useRef()
    const addMenuFormBtn = useRef()
    const menuQueryRef = useRef()

    useEffect(async () => {
        initMenus()
    }, []);


    return (
        <div className="flex flex-col w-full mx-auto p-2 mt-5">
            {/* Search bar, number of items and filter */}
            <div className="flex w-full justify-center px-9 py-2">
                <form className="ml-2 mr-5 my-auto py-2 px-4 rounded-full 
                 flex flex-nowrap items-center group 
                bg-[color:var(--text)] text-[color:var(--accent2)]"
                    onSubmit={searchMenu}>
                    <input placeholder="search" ref={menuQueryRef} className="text-2xl font-bold"></input>
                    <div className="flex items-center justify-between">
                        <button><FontAwesomeIcon icon={faSearch} className="mx-1" size="lg"></FontAwesomeIcon></button>
                        {isFiltered &&
                            <button type="button" onClick={clearSearch}><FontAwesomeIcon icon={faTimes} className="mx-1" size="lg"></FontAwesomeIcon></button>}
                    </div>
                </form>
            </div>


            {/* Add menu form */}
            <form
                ref={addMenuFormRef}
                onTransitionEnd={clearFormInput}
                onSubmit={addNewMenu}
                className="mx-auto w-fit flex flex-col max-h-0 
                transition-[max-height] duration-300 overflow-hidden mt-4 bg-transparent rounded-lg">
                <input
                    required
                    placeholder="Restaurant name"
                    className="mx-10 text-3xl font-bold bg-transparent 
                border-b border-white text-[color:var(--text)] m-5 text-center"></input>
                <div className="w-full flex justify-center">
                    <button
                        className="border text-[color:var(--text)] font-bold 
                        hover:bg-[color:var(--text)] hover:text-[color:var(--accent2)] 
                    transition m-2 p-2 w-fit rounded-md">
                        <FontAwesomeIcon icon={faPlus} className="mx-2"></FontAwesomeIcon>
                        Add
                    </button>
                    <button
                        onClick={toggleNewMenuForm}
                        type="button"
                        className="border text-white font-bold hover:bg-[color:var(--text)] 
                        hover:text-[color:var(--accent2)] 
                    transition m-2 p-2 w-fit rounded-md">
                        <FontAwesomeIcon icon={faTimes} className="mx-2"></FontAwesomeIcon>
                        Cancel
                    </button>
                </div>
            </form>

            <button
                ref={addMenuFormBtn}
                onClick={toggleNewMenuForm}
                className="border bg-[color:var(--text)] text-[color:var(--accent2)] font-bold 
                hover:scale-110 transition-transform mx-auto my-2 p-2 w-fit rounded-md">
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

    async function clearSearch(event) {

        menuQueryRef.current.value = ""

        await refreshMenus()
        setIsFiltered(false)
    }

    async function searchMenu(event) {

        event.preventDefault()

        const query = menuQueryRef.current.value

        if (query === "") {
            refreshMenus()
            return
        }

        const url = `${SERVER_URL}/menu?uid=${currentUser.uid}&query=${query}`

        try {
            let res = await fetch(url)

            if (!res.ok) {
                throw new Error(`Search failed with status ${res.status}`)
            }

            let newMenus = await res.json()
            setEmenus(newMenus)
            setIsFiltered(true)
        }
        catch (err) {
            errorToast("Search failed")
            return
        }
    }
}