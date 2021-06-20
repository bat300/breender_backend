"use strict";

import { Pet as PetModel } from "../models/pet.model.js";
import { User as UserModel, Review as ReviewModel } from "../models/user.model.js";

const getPets = async (req, res) => {
    try {
        let sex = req.query.sex;
        let breed = req.query.breed;
        let age = req.query.age[0].split(',');
        let species = req.query.species;

        var dateFrom = new Date()
        dateFrom.setFullYear(dateFrom.getFullYear() - parseInt(age[1]))

        var dateTill = new Date()
        dateTill.setFullYear(dateTill.getFullYear() - parseInt(age[0]))

        if ((sex == null || sex == '') && (breed == null || breed == '')) {
            if (species == null || species == '') {
                let pets = await PetModel.find({ $and: [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
                return res.status(200).json({ pets: pets });
            } else {
                let pets = await PetModel.find({ $and: [{ birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }, { species: species }] }).exec();
                return res.status(200).json({ pets: pets });
            }
        } else if (sex == null || sex == '') {
            let pets = await PetModel.find({ $and: [{ breed: breed }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
            return res.status(200).json({ pets: pets });
        } else if (breed == null || breed == '') {
            if (species == null || species == '') {
                let pets = await PetModel.find({ $and: [{ sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
                return res.status(200).json({ pets: pets });
            } else {
                let pets = await PetModel.find({ $and: [{ sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }, { species: species }] }).exec();
                return res.status(200).json({ pets: pets });
            }
        }
        let pets = await PetModel.find({ $and: [{ breed: breed }, { sex: sex }, { birthDate: { $gte: dateFrom } }, { birthDate: { $lte: dateTill } }] }).exec();
        return res.status(200).json({ pets: pets });
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
}

export { getPets }