import { Message } from "../models/conversation.model.js"
import mongoose from "mongoose"

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

const listUnseen = async (req, res) => {
    try {
        // get count of unseen messages
        let unseenMessages = await Message.aggregate([
            { $match: { $and: [{ receiver: mongoose.Types.ObjectId(req.params.userId) }, { seen: false }] } },
            {
                $group: {
                    _id: "$conversationId",
                    count: { $sum: 1 },
                },
            },
        ])

        // return messages
        return res.status(200).json(unseenMessages)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const updateManyToSeen = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })
    }

    // handle the request
    try {
        // find and update masseages by id
        if (Array.isArray(req.body.messagesToUpdate) && req.body.messagesToUpdate.length !== 0) {
            const messagesIdArray = req.body.messagesToUpdate.map((id) => {
                return mongoose.Types.ObjectId(id)
            })
            const updatedMessages = await Message.updateMany({ _id: { $in: messagesIdArray } }, { seen: true })

            return res.status(200)
        } else {
            return res.status(400).json({
                error: "Bad Request",
                message: "The messages array is empty",
                body: req.body,
                array: req.body.messagesToUpdate,
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { list, create, updateManyToSeen, listUnseen }
