import { Pet } from "../models/pet.model.js"
const getDocs = async (req, res) => {
    try {
        // get pet with id from database
        let docs = await Pet.aggregate([
            [
                {
                    //add user to his pet
                    $lookup: {
                        from: "users",
                        localField: "ownerId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    //get only documents where user has a premium account
                    $match: {
                        "user.subscriptionPlan": "premium",
                    },
                },
                {
                    $project: {
                        competitions: {
                            //create field named competitions
                            $filter: {
                                input: "$competitions", // document array field called competitions
                                as: "item", //name every elem of array as item
                                cond: { $and: [{ $ne: ["$$item.certificate.verified", true] }, { $ne: ["$$item.certificate.declined", true] }] },
                            },
                        },
                        documents: {
                            //create field named documents
                            $filter: {
                                input: "$documents", // document array field called documents
                                as: "item", //name every elem of array as item
                                cond: { $and: [{ $ne: ["$$item.verified", true] }, { $ne: ["$$item.declined", true] }] },
                            },
                        },
                    },
                },
                {
                    $project: {
                        documents: {
                            $concatArrays: ["$documents", "$competitions"],
                        },
                    },
                },
                {
                    $match: {
                        //get only docs where competitions not empty
                        documents: {
                            $ne: [],
                        },
                    },
                },
            ],
        ])
        // return documents
        return res.status(200).json(docs)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}

const verify = async (req, res) => {
    try {
        //find pet which has a certificate with this id and set its verification status to true

        if (req.body.docType === "comp") {
            console.log(req.body)
            await Pet.updateOne({ "competitions.certificate._id": req.body.docId }, { $set: { "competitions.$.certificate.verified": true, "competitions.$.certificate.verificationDate": new Date() } }).exec()
        } else {
            await Pet.updateOne({ "documents._id": req.body.docId }, { $set: { "documents.$.verified": true, "documents.$.verificationDate": new Date() } }).exec()
        }

        return res.status(200).json("Document verified")
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}
const decline = async (req, res) => {
    try {
        //find pet which has a certificate with this id and set its verification status to true

        if (req.body.docType === "comp") {
            console.log(req.body)
            await Pet.updateOne({ "competitions.certificate._id": req.body.docId }, { $set: { "competitions.$.certificate.declined": true, "competitions.$.certificate.verificationDate": new Date() } }).exec()
        } else {
            await Pet.updateOne({ "documents._id": req.body.docId }, { $set: { "documents.$.declined": true, "documents.$.verificationDate": new Date() } }).exec()
        }

        return res.status(200).json("Document declined")
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}
export { getDocs, verify, decline }
