import { Pet } from "../models/pet.model.js"
import User from "../models/user.model.js"
import Review from "../models/review.model.js"
import * as bcrypt from "bcrypt"
import mongoose from "mongoose"
import { Transaction } from "../models/transaction.model.js"

const list = async (req, res) => {
    try {
        let ownerId = req.params.ownerId
        // get all pets of a user in the database
        let pets = await Pet.find({ ownerId: ownerId }).exec()

        // return pets
        return res.status(200).json(pets)
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const read = async (req, res) => {
    try {
        // get user with id from database
        let user = await User.findById(req.params.id).select("-password").exec()

        // if user wasn't found, return 404
        if (!user)
            return res.status(404).json({
                error: "Not Found",
                message: `User was not found`,
            })

        // return user
        return res.status(200).json(user)
    } catch (err) {
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
        // update the password only if given in the request body
        if (typeof req.body.password === "undefined" || req.body.password === null) {
            let user = await User.findById(req.params.id).exec()
            req.body.password = user.password
        } else {
            // hash the password
            const salt = bcrypt.genSaltSync(8)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)
            req.body.password = hashedPassword
        }

        let user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //return the updated object
            runValidators: true,
        })
            .select("-password")
            .exec()

        // return updated user
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const getReviewsOnUser = async (req, res) => {
    try {
        // get reviews on user from database
        let reviews = await Review.aggregate([
            {
                $match: {
                    revieweeId: mongoose.Types.ObjectId(req.params.id),
                },
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "transactionNr",
                    foreignField: "orderNr",
                    as: "transactions",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewerId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    _id: 1,
                    reviewerId: 1,
                    reviweeId: 1,
                    review: 1,
                    rating: 1,
                    reviewDate: 1,
                    transaction: {
                        $arrayElemAt: ["$transactions", 0],
                    },
                    username: {
                        $arrayElemAt: ["$user.username", 0],
                    },
                },
            },
        ])

        // if reviews weren't found, return 404
        if (!reviews)
            return res.status(404).json({
                error: "Not Found",
                message: `Reviews were not found`,
            })

        // return user
        return res.status(200).json(reviews)
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}

const createReview = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })

    // handle the request
    try {
        // create review in a database
        var reviewToSave = req.body.review
        const reviewsForTransactionCount = await (await Review.find({ transactionNr: reviewToSave.transactionNr, reviewerId: reviewToSave.reviewerId })).count
        if (!reviewsForTransactionCount || reviewsForTransactionCount == 0) {
            reviewToSave.reviewDate = new Date()
            let review = await Review.create(reviewToSave)
            await Transaction.updateOne({ orderNr: req.body.review.transactionNr }, { $set: { isReviewed: true } }).exec()

            // return created review
            return res.status(201).json(review)
        } else {
            return res.status(400).json({
                error: "Bad Request",
                message: "You have already reviewed this transaction",
            })
        }
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { list, read, update, getReviewsOnUser, createReview }
