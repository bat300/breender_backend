import { Pet } from "../models/pet.model.js"
import { Pet } from "../models/pet.model.js"

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

        var dateFrom = new Date()
        dateFrom.setFullYear(dateFrom.getFullYear() - parseInt(age[1]))

        var dateTill = new Date()
        dateTill.setFullYear(dateTill.getFullYear() - parseInt(age[0]))

        if ((sex == null || sex == "") && (breed == null || breed == "")) {
            if (species == null || species == "") {
                let pets = await Pet.find({ $and: [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec()
                return res.status(200).json({ pets: pets })
            } else {
                let pets = await Pet.find({ $and: [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }, { species: species }] }).exec()
                return res.status(200).json({ pets: pets })
            }
        } else if (sex == null || sex == "") {
            let pets = await Pet.find({ $and: [{ breed: breed }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec()
            return res.status(200).json({ pets: pets })
        } else if (breed == null || breed == "") {
            if (species == null || species == "") {
                let pets = await Pet.find({ $and: [{ sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec()
                return res.status(200).json({ pets: pets })
            } else {
                let pets = await Pet.find({ $and: [{ sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }, { species: species }] }).exec()
                return res.status(200).json({ pets: pets })
            }
        }
        let pets = await Pet.find({ $and: [{ breed: breed }, { sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec()
        return res.status(200).json({ pets: pets })
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

export { list, create, update, remove, read, getPets }
