import User from "../models/user.model.js"
import { Pet } from "../models/pet.model.js"
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
        // create pet in a database
        let pet = await Pet.create(req.body)

        // return created pet
        return res.status(201).json(pet)
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
        // get pet with id from database
        let pet = await Pet.findById(req.params.id).exec()

        // if pet wasn't found, return 404
        if (!pet)
            return res.status(404).json({
                error: "Not Found",
                message: `Pet was not found`,
            })

        // return pet
        return res.status(200).json(pet)
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
        let pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).exec()

        // return updated pet
        return res.status(200).json(pet)
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
        await Pet.findByIdAndRemove(req.params.id).exec()

        // return message that pet was deleted
        return res.status(200).json({ message: `Pet with id${req.params.id} was deleted` })
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
        // get all pets in the database
        let pets = await Pet.find({}).exec()

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

const getPets = async (req, res) => {
    try {
        let sex = req.query.sex
        let breed = req.query.breed
        let age = req.query.age[0].split(",")
        let species = req.query.species

        // Pagination
        let page = parseInt(req.query.page - 1 || "0")
        const itemsPerPage = 10
        var petCount = 0
        var totalPages = 0

        let showOwn = req.query.showOwn === 'false' ? false : true;
        let userId = req.query.user

        var dateFrom = new Date()
        dateFrom.setFullYear(dateFrom.getFullYear() - parseInt(age[1]))

        var dateTill = new Date()
        dateTill.setFullYear(dateTill.getFullYear() - parseInt(age[0]))

        let premiumUsers = (await User.find({ subscriptionPlan: "premium" }).select("_id")).map(function (u) {
            return mongoose.Types.ObjectId(u._id)
        })
        let freeUsers = (await User.find({ subscriptionPlan: "free" }).select("_id")).map(function (u) {
            return mongoose.Types.ObjectId(u._id)
        })

        // check if the values are empty, otherwise save for the search
        let ageSearch = [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }]
        let sexSearch = sex == null || sex == "" ? [] : [{ sex: sex }]
        let breedSearch = breed == null || breed == "" ? [] : [{ breed: breed }]
        let speciesSearch = species == null || species == "" ? [] : [{ species: species }]
        // check if user id was given, if display of own pets is disabled - filter them out
        let userSearch = userId === '' ? [] : showOwn === true ? [] : [{ ownerId: { $ne: userId } }]

        petCount = await (await Pet.find({ $and: [...userSearch, ...ageSearch, ...sexSearch, ...breedSearch, ...speciesSearch] } )).length
        let premiumPets = await Pet.find({ $and: [...userSearch, ...ageSearch, ...sexSearch, ...breedSearch, ...speciesSearch] } )
            .populate("ownerId", "subscriptionPlan")
            .exec()
        let freePets = await Pet.findawait Pet.find({ $and: [...userSearch, ...ageSearch, ...sexSearch, ...breedSearch, ...speciesSearch] } )
            .populate("ownerId", "subscriptionPlan")
            .exec()
        let pets = premiumPets.concat(freePets)
        pets = pets.slice(itemsPerPage * page, itemsPerPage * (page + 1))
        return res.status(200).json({ pets: pets, totalPages: Math.ceil(petCount / itemsPerPage) })
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { list, create, update, remove, read, getPets }
