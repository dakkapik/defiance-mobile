export default function (credentials, endpoint) {
    return new Promise (( resolve, reject ) => {
        const io = require("socket.io-client");
    
        const socket = io(endpoint)
    
        socket.on("connect", () => {
            socket.emit("new-user", {id: credentials.id, role: credentials.role, store: "psq2"});
        });
        
        socket.on("login-success", () => {
            resolve(socket);
        });

        socket.on("error", (error) => {
            socket.disconnect();
            reject(error);
        })
    })
}