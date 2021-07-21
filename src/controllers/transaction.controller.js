import { Pet } from "../models/pet.model.js"
import User from "../models/user.model.js"
import { Transaction } from "../models/transaction.model.js"
import moment from "moment"
import nodemailer from "nodemailer"

/**
 * Controller file for the transactions handling
 */

const STATUS_TYPE = {
    PENDING: "pending",
    SUCCESS: "success",
    FAIL: "fail",
}

// send the last reminder to the user to update the transaction status
const sendReminder = (user, transaction) => {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "breenderseba@gmail.com",
            pass: "breenderTeamSEBA2021",
        },
    })

    var mailOptions = {
        from: "breenderseba@gmail.com",
        to: user.email,
        subject: "Reminder to update your status",
        text: `Hello ${user.username} \n\n Please update your status on the transaction #${transaction._id}. This is the last reminder. In 24 hours the status will be set automatically. \n\nThank You!\n`,
    }
    transporter.sendMail(mailOptions, function () { })

    // update transaction property "reminderSent" in db
    Transaction.findByIdAndUpdate(
        transaction._id,
        { reminderSent: true },
        {
            new: true,
            runValidators: true,
        }
    ).exec()
}

// default function to update transaction status to success
const updateStatusToSuccess = async (transaction) => {
    let updatedTransaction = await Transaction.findByIdAndUpdate(
        transaction._id,
        { status: STATUS_TYPE.SUCCESS, processed: true },
        {
            new: true,
            runValidators: true,
        }
    ).exec()
    return updatedTransaction
}

// default function to update transaction status to fail
const updateStatusToFail = async (transaction) => {
    let updatedTransaction = await Transaction.findByIdAndUpdate(
        transaction._id,
        { status: STATUS_TYPE.FAIL, processed: true },
        {
            new: true,
            runValidators: true,
        }
    ).exec()
    return updatedTransaction
}

// logic for checking the transaction status and updating it
const checkTransactionStatus = async (transactionsData) => {
    let transactions = transactionsData
    // go through each transaction for the user
    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i]

        // check if deadline is after now, if false it's expired
        let deadlineExpired = moment(transaction.deadline).isBefore()

        // check if transaction was already finalized
        if (!transaction.processed) {
            let receiverStatus = transaction.receiverResponse
            let senderStatus = transaction.senderResponse

            // check if till the deadline one day left (for the reminder)
            let deadlineOneDayBefore = moment(transaction.deadline).subtract(24, "hours").isBefore()

            if (senderStatus === STATUS_TYPE.FAIL) {
                if (receiverStatus === STATUS_TYPE.PENDING) {
                    if (deadlineExpired) {
                        // set status failed
                        transaction = await updateStatusToFail(transaction)
                    } else if (deadlineOneDayBefore) {
                        // send reminder
                        if (!transaction.reminderSent) {
                            let receiver = await User.findById(transaction.receiverId).exec()
                            sendReminder(receiver, transaction)
                        }
                    }
                } else if (receiverStatus === STATUS_TYPE.FAIL) {
                    // return money to paying party
                    // set status failed
                    transaction = await updateStatusToFail(transaction)
                } else if (receiverStatus === STATUS_TYPE.SUCCESS) {
                    // start investigation
                    // set status failed
                    transaction = await updateStatusToFail(transaction)
                }
            } else if (senderStatus === STATUS_TYPE.SUCCESS) {
                // set status to success
                transaction = await updateStatusToSuccess(transaction)
            } else if (senderStatus === STATUS_TYPE.PENDING) {
                // check if deadline is expired
                if (deadlineExpired) {
                    if (receiverStatus === STATUS_TYPE.SUCCESS) {
                        // set status to success
                        transaction = await updateStatusToSuccess(transaction)
                    } else if (receiverStatus === STATUS_TYPE.PENDING) {
                        // send status to success
                        transaction = await updateStatusToSuccess(transaction)
                    } else if (receiverStatus === STATUS_TYPE.FAIL) {
                        // set to failed, return money
                        transaction = await updateStatusToFail(transaction)
                    }
                }
            }
        } else {
            // remove purchased pet flag if the transaction is ready
            if (transaction.status === STATUS_TYPE.FAIL || (transaction.status === STATUS_TYPE.SUCCESS && deadlineExpired)) {
                // find pet and set purchased flag to false
                await Pet.findByIdAndUpdate(transaction.pet, { purchased: false }, {
                    new: true,
                    runValidators: true,
                }).exec()
            }
        }
    }
    return transactions
}

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
        // find and update transaction with id
        let transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).exec()

        let result = await checkTransactionStatus([transaction])[0]

        // return updated transaction
        return res.status(200).json(result)
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
        // find and remove transaction
        await Transaction.findByIdAndRemove(req.params.id).exec()

        // return message that transaction was deleted
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
        // get all transactions for the user independent of the sender or receiver role in the database
        let transactions = await Transaction.find({ $or: [{ senderId: id }, { receiverId: id }] }).exec()

        let result = await checkTransactionStatus(transactions)

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
