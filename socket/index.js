// TODO: use import if possible
const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
})

let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) ? users.push({ userId, socketId }) : console.log("FAIL")
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    //when ceonnect
    console.log("A user connected.")

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        console.log("Adding user " + userId + "with socketId" + socket.id)
        addUser(userId, socket.id)
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log("Sending and getting a message between " + senderId + " and " + receiverId)
        const user = getUser(receiverId)
        try {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            })
        } catch (error) {
            console.log("User not currently online")
        }
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})
