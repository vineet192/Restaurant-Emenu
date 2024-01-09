import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function about(props) {

    const { currentUser } = useAuth();
    const router = useRouter()
    const HOST = process.env.NEXT_PUBLIC_HOSTNAME

    if (!currentUser) {
        router.push(HOST)
        return (<></>)
    }

    return (
        <div>

            <div className="flex flex-col justify-center m-10">
                <h1 className="text-2xl my-5 text-[color:var(--accent1)]">What?</h1>
                <p className="text-[color:var(--text)]">The product is a cloud-based online menu management system for restaurants.
                    It allows restaurant owners to easily create, edit, and manage their menu, making it accessible to customers via a QR code scan.
                    The system provides an intuitive interface for adding, modifying, and deleting menu items
                    Customers can access the menu through a mobile app, using the QR code displayed on the restaurant's table or menu.
                    This helps streamline the ordering process and eliminates the need for physical menus, promoting a more contactless dining experience.</p>

                <h1 className="text-2xl my-5 text-[color:var(--accent1)]">Why?</h1>
                <p className="text-[color:var(--text)]">A crowdfunded open-source version of an electronic menu manager would be of immense benefit to small to medium restaturant business owners.</p>

                <h1 className="text-2xl my-5 text-[color:var(--accent1)]">Developer</h1>
                <p className="text-[color:var(--text)]">My name is Vineet Kalghatgi, I am a big fan of the open source culture and this is my small bit in contributing to it. You can contact by email at <a href="mailto:vkalghat@gmail.com" className="text-blue-600 underline">vkalghat@gmail.com</a>. If you're interested in contributing or just wanna say hi, feel free to drop a mail!</p>
            </div>
        </div>
    )
}