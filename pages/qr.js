import { useRouter } from "next/router"
import { useEffect } from "react";
import QRCode from "react-qr-code";

export default function qr(props) {

    const router = useRouter();
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;
    const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME;
    const url = SERVER_URL + '/menu/' + router.query.id
    
    useEffect(() => {
        print_qr()
    })

    return (
        <div>
            <div id="content-div">
                <div style={{
                    display: "flex", flexDirection: "column", justifyItems: "center",
                    width: "100%", marginTop: "50%", alignItems: "center"
                }}>
                    <QRCode value={url}></QRCode>
                </div>
            </div>
            <iframe id="qr-frame" className="h-0 w-full">
            </iframe>
        </div>
    )

    function print_qr() {

        let fr = document.getElementById('qr-frame').contentWindow
        let container = document.getElementById('content-div')

        fr.document.open()
        fr.document.write(container.innerHTML)
        fr.document.close()

        fr.focus()
        fr.addEventListener('afterprint', () => {
            console.log("Print over :(")
            router.push(HOST_URL)
        })
        fr.print()
    }
}
