import { Conversation } from "../models/conversation.model.js"
import mongoose from "mongoose"

// TODO: Save id as ObjectId and not string
const create = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })

    // handle the request
    try {
        // create conversation in a database
        let conversation = await Conversation.create(req.body)

        // return created conversation
        return res.status(201).json(conversation)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const read = async (req, res) => {
    try {
        // get conversation with id from database
        let conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        }).populate("members")

        // if conversation wasn't found, return 404
        if (!conversation)
            return res.status(404).json({
                error: "Not Found",
                message: `Conversation was not found`,
            })

        // return conversation
        return res.status(200).json(conversation)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}

const remove = async (req, res) => {
    try {
        // find and remove conversation
        await Conversation.findByIdAndRemove(req.params.id).exec()

        // return conversation that conversation was deleted
        return res.status(200).json({ message: `Conversation with id${req.params.id} was deleted` })
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
        const conversation = await Conversation.find({
            members: { $in: [mongoose.Types.ObjectId(req.params.userId)] },
        }).populate("members")
        res.status(200).json(conversation)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { list, create, remove, read }
