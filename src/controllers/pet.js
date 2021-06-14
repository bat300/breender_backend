"use strict";

import { Pet as PetModel, Breed as BreedModel } from "../models/pet.model.js";

const getPets = async (req, res) => {
    try {
        console.log('I am in getPets')
        let species = req.params.species;
        let sex = req.params.sex;
        let breed = req.params.breed;
        let age = req.params.age;

        let breedObject = await BreedModel.find({ name: breed }).exec()

        let pets = await PetModel.find({ $and: [{ species: species }, { sex: sex }, { breed: breedObject.Id }, { age: { $gte: age[0] } }, { age: { $lte: age[1] } }] }).exec();
        return res.status(200).json({ pets: pets });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
}


export default getPets