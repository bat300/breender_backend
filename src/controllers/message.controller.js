import { Message } from "../models/conversation.model.js"

const create = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })

    // handle the request
    try {
        // create message in a database
        let message = await Message.create(req.body)

        // return created message
        return res.status(201).json(message)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const list = async (req, res) => {
    try {
        // get all messages in the database
        let messages = await Message.find({
            conversationId: req.params.conversationId,
        })

        // return messages
        return res.status(200).json(messages)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { list, create }
