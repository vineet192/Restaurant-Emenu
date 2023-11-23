import { useRouter } from "next/router"

export default function PreviewButton(props) {

    const router = useRouter()

    return (
        <button className='flex p-2 m-3 justify-center items-center rounded-lg border-2 
    border-blue-500 bg-white text-blue-500 hover:bg-blue-500 
    hover:text-white transition ease-in-out'
            onClick={() => { router.push(props.preview_url) }}>
            <h1 className="mx-2 text-2xl font-bold">Preview</h1>
        </button>)
}