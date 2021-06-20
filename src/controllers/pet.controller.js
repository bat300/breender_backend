"use strict";

import { Pet as PetModel, Breed as BreedModel } from "../models/pet.model.js";
import { User as UserModel, Review as ReviewModel } from "../models/user.model.js";

const getPets = async (req, res) => {
    try {
        let sex = req.query.sex;
        let breed = req.query.breed;
        let age = req.query.age[0].split(',');
        let species = req.query.species;

        let breedObject = await BreedModel.findOne({ name: breed }).exec();
        var dateFrom = new Date()
        dateFrom.setFullYear(dateFrom.getFullYear() - parseInt(age[1]))

        var dateTill = new Date()
        dateTill.setFullYear(dateTill.getFullYear() - parseInt(age[0]))

        if ((sex == null || sex == '') && (breed == null || breed == '')) {
            if (species == null || species == '') {
                let pets = await PetModel.find({ $and: [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
                return res.status(200).json({ pets: pets, breed: breed });
            } else {
                let breeds = await BreedModel.find({ species: species }, { _id: 1 }).exec();
                let breed_ids = breeds.map(function (breed) { return breed._id });
                let pets = await PetModel.find({ $and: [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }, { breedId: { $in: breed_ids } }] }).exec();
                return res.status(200).json({ pets: pets, breed: breed });
            }
        } else if (sex == null || sex == '') {
            if (breedObject == null) {
                return res.status(404).json({ pets: [], breed: null });
            }
            let pets = await PetModel.find({ $and: [{ breedId: breedObject._id }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
            return res.status(200).json({ pets: pets, breed: breed });
        } else if (breed == null || breed == '') {
            if (species == null || species == '') {
                let pets = await PetModel.find({ $and: [{ sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
                return res.status(200).json({ pets: pets, breed: breed });
            } else {
                if (breedObject == null) {
                    return res.status(404).json({ pets: [], breed: null });
                }
                let breeds = await BreedModel.find({ species: species }, { _id: 1 }).exec();
                let breed_ids = breeds.map(function (breed) { return breed._id });
                let pets = await PetModel.find({ $and: [{ sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }, { breedId: { $in: breed_ids } }] }).exec();
                return res.status(200).json({ pets: pets, breed: breed });
            }
        }
        let pets = await PetModel.find({ $and: [{ breedId: breedObject._id }, { sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
        return res.status(200).json({ pets: pets, breed: breed });
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
}

const addPet = async (req, res) => {
    try {
        let breedObject = await BreedModel.find({}).exec();
        console.log(breedObject);
        let owner = await UserModel.find({}).exec();
        console.log(owner);

        let pet = await PetModel.create({ ownerId: owner[0]._id, officialName: "Kleo", birthDate: new Date(2015, 5, 20), sex: "female", profilePicture: "../images/pixel.jpg", breedId: breedObject[0]._id });
        console.log(pet);
        return res.status(200).json({ pet: pet });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
}

export { getPets, addPet }