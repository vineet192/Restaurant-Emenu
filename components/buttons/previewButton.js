import { useRouter } from "next/router"

export default function PreviewButton(props) {

    const router = useRouter()

    return (
        <button className='flex p-2 m-3 justify-center items-center border-2 
     bg-[color:var(--background2)] text-[color:var(--accent2)] hover:scale-110
    transition-transform ease-in-out'
            onClick={() => { router.push(props.preview_url) }}>
            <h1 className="mx-2 text-2xl font-bold">Preview</h1>
        </button>)
}