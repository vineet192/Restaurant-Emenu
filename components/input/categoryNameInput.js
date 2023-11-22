import { useEffect, useRef } from "react"

export default function CategoryNameInput(props) {

    const categoryInputRef = useRef(null)

    useEffect(() => {
        if(!categoryInputRef){
            return
        }
        categoryInputRef.current.scrollIntoView({behavior: "smooth"})
        categoryInputRef.current.focus({preventScroll: true})

    }, [])
    
    return (
    <input
        className="my-2 p-2 flex-shrink-0 outline-none border-transparent 
        border-2 cursor-pointer focus:border-blue-500 transition"
        placeholder="Enter a category"
        ref = {categoryInputRef}
        value={props.value}
        onFocus={props.onFocus}
        onChange={props.onChange}></input>)
}