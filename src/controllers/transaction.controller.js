import { Pet } from "../models/pet.model.js"
import User from "../models/user.model.js"
import { Transaction } from "../models/transaction.model.js"

const create = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })

    // handle the request
    try {
        req.body.createdAt = new Date()
        // create transaction in a database
        let transaction = await Transaction.create(req.body)

        // return created transaction
        return res.status(201).json(transaction)
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const read = async (req, res) => {
    try {
        // transaction with id from database
        let transaction = await Transaction.findById(req.params.id).exec()

        // if transaction wasn't found, return 404
        if (!transaction)
            return res.status(404).json({
                error: "Not Found",
                message: `Transaction was not found`,
            })

        // return transaction
        return res.status(200).json(transaction)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}

const update = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })
    }

    // handle the request
    try {
        // find and update movie with id
        let transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).exec()

        // return updated pet
        return res.status(200).json(transaction)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const remove = async (req, res) => {
    try {
        // find and remove pet
        await Transaction.findByIdAndRemove(req.params.id).exec()

        // return message that pet was deleted
        return res.status(200).json({ message: `Transaction with id${req.params.id} was deleted` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const listFoUser = async (req, res) => {
    try {
        let id = req.query.userId
        // get all pets in the database
        let transactions = await Transaction.find({ $or: [{ senderId: id }, { receiverId: id }] }).exec()

        let result = transactions

        for (let i = 0; i < result.length; i++) {
            let pet = await Pet.findById(result[i].pet).exec()
            let sender = await User.findById(result[i].senderId).exec()
            let receiver = await User.findById(result[i].receiverId).exec()

            result[i].pet = pet
            result[i].senderId = sender
            result[i].receiverId = receiver
        }

        // return transactions
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { listFoUser, create, update, remove, read }
