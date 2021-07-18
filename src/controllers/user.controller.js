import { Pet } from "../models/pet.model.js"
import { User, Review } from "../models/user.model.js"


const list = async (req, res) => {
    try {
        console.log('I am in list')
        let ownerId = req.params.ownerId
        console.log('The owner id is ', ownerId)
        // get all pets of a user in the database
        let pets = await Pet.find({ ownerId: ownerId }).exec()

        // return pets
        return res.status(200).json(pets)
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
        // get user with id from database
        let user = await User.findById(req.params.id).exec()

        // if user wasn't found, return 404
        if (!user)
            return res.status(404).json({
                error: "Not Found",
                message: `User was not found`,
            })

        // return user
        return res.status(200).json(user)
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
        // find and update user with id
        let user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).exec()

        // return updated user
        return res.status(200).json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const getReviewsOnUser = async (req, res) => {
    try {
        // get reviews on user from database
        let reviews = await Review.find({ revieweeId: req.params.id }).exec()

        // if reviews weren't found, return 404
        if (!reviews)
            return res.status(404).json({
                error: "Not Found",
                message: `Reviews were not found`,
            })

        // return user
        return res.status(200).json(reviews)
    } catch (err) {
        console.log(err)
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
        let review = await Review.create(req.body)

        // return created review
        return res.status(201).json(review)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export {
    list,
    read,
    update,
    getReviewsOnUser,
    createReview
}