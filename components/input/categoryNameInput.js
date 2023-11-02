export default function CategoryNameInput(props) {
    
    return (
    <input
        className="my-2 p-2 flex-shrink-0 outline-none border-transparent border-2 cursor-pointer focus:border-blue-500 transition"
        placeholder="Enter a category"
        value={props.value}
        onFocus={props.onFocus}
        onChange={props.onChange}></input>)
}