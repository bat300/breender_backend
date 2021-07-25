const nodemailer = require("nodemailer")
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
    socket.on("sendMessage", async ({ senderId, receiverId, receiverEmail, receiverUsername, text }) => {
        console.log("Sending and getting a message between " + senderId + " and " + receiverId)
        const user = getUser(receiverId)
        try {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            })
        } catch (error) {
            console.log("User not currently online")
            // Send e-mail for missed message
            var transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "breenderseba@gmail.com",
                    pass: "breenderTeamSEBA2021",
                },
            })
            //send an email to notify user about new message
            var mailOptions = {
                from: "breenderseba@gmail.com",
                to: receiverEmail,
                subject: "New Message on Breender",
                text: "Hello " + receiverUsername + ",\n\n" + "You have a new message on your Breender account. \n\nHave a nice day!\n",
            }
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({ msg: err })
                }
                console.log("Notification e-mail sent to " + receiverId)
                return res.status(200).send("A notification email has been sent to " + receiverEmail + ".")
            })
        }
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})
