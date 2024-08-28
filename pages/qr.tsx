import { useRouter } from "next/router"
import { useEffect } from "react";
import QRCode from "react-qr-code";

export default function qr() {

    const router = useRouter();
    const HOST_URL = process.env.NEXT_PUBLIC_HOSTNAME

    useEffect(() => {
        print_qr()
    })

    return (
        <div>
            <div id="content-div">
                <div
                    style={{
                        display: "flex", flexDirection: "column", justifyItems: "center",
                        width: "100%", marginTop: "50%", alignItems: "center"
                    }}
                >
                    <QRCode value={router.query.url as string}></QRCode>
                    <span style={{ margin: "15px" }}>{router.query.url}</span>
                </div>
            </div>
            <iframe id="qr-frame" className="w-0 h-0">
            </iframe>
        </div>
    )

    function print_qr() {

        const frame = document.getElementById('qr-frame') as HTMLIFrameElement

        const frameWindow = frame.contentWindow
        const container = document.getElementById('content-div')

        frameWindow.document.open()
        frameWindow.document.write(container.innerHTML)
        frameWindow.document.close()

        frameWindow.focus()
        frameWindow.addEventListener('afterprint', () => {
            router.push(HOST_URL)
        })
        frameWindow.print()
    }
}
