import { Manager } from "socket.io-client"

export default function (credentials, endpoint) {
    const manager = new Manager(endpoint)

    const socket = manager.socket("",{
        auth: {
            token: credentials
        }
    })

    socket.on("connect", () =>{
        console.log(socket.id)
        socket.emit("new-user", {id: 3533, role: "manager", store:"psq2" })
    })
}