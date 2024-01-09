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
        className="my-2 p-2 flex-shrink-0 border-transparent 
        cursor-pointer text-[color:var(--accent2)] bg-[color:var(--background2)] 
        rounded-full transition font-bold"
        placeholder="Enter a category"
        ref = {categoryInputRef}
        value={props.value}
        onFocus={props.onFocus}
        onChange={props.onChange}></input>)
}