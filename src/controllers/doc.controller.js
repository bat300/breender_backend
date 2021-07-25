import { Pet } from "../models/pet.model.js"
import nodemailer from "nodemailer"
import User from "../models/user.model.js"

const getDocs = async (req, res) => { //get unpocessed docs
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
                        "ownerId": 1,
                        "officialName": 1,
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
                        "ownerId": 1,
                        "officialName": 1,
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
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}

const getProcessedDocs = async (req, res) => { //get verified or declined documents
    let condition = req.params.condition;
    try {
        let docs = await Pet.aggregate(
            [
                [
                    {
                      $project: {
                        competitions: {
                          $filter: {
                            input: '$competitions', 
                            as: 'item', 
                            cond: {
                              $ne: [
                                `$$item.certificate.${condition}`, false
                              ]
                            }
                          }
                        }, 
                        documents: {
                          $filter: {
                            input: '$documents', 
                            as: 'item', 
                            cond: {
                              $ne: [
                                `$$item.${condition}`, false
                              ]
                            }
                          }
                        }
                      }
                    }, {
                      $project: {
                        documents: {
                          $concatArrays: [
                            '$documents', '$competitions'
                          ]
                        }
                      }
                    }, {
                      $match: {
                        documents: {
                          $ne: []
                        }
                      }
                    }
                  ]
            ]
        );
        return res.status(200).json(docs)
    } catch (err) {
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
            await Pet.updateOne({ "competitions.certificate._id": req.body.docId }, { $set: { "competitions.$.certificate.verified": true, "competitions.$.certificate.verificationDate": new Date() } }).exec()
        } else {
            await Pet.updateOne({ "documents._id": req.body.docId }, { $set: { "documents.$.verified": true, "documents.$.verificationDate": new Date() } }).exec()
        }

        let user = await User.findById(req.body.ownerId).exec();

        await sendDocumentReviewEmail(user, req.body.officialName)

        return res.status(200).json("Document verified")
    } catch (err) {
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
            await Pet.updateOne({ "competitions.certificate._id": req.body.docId }, { $set: { "competitions.$.certificate.declined": true, "competitions.$.certificate.verificationDate": new Date() } }).exec()
        } else {
            await Pet.updateOne({ "documents._id": req.body.docId }, { $set: { "documents.$.declined": true, "documents.$.verificationDate": new Date() } }).exec()
        }

        let user = await User.findById(req.body.ownerId).exec();

        await sendDocumentReviewEmail(user, req.body.officialName)

        return res.status(200).json("Document declined")
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}

const sendDocumentReviewEmail = async (user, petName) => {
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
        subject: "Document reviewed",
        text: "Hello " + user.username + ",\n\n" + "A document of your pet named "+ petName + " was reviewed. Please check the status on the pet profile." + "\n\nThank You,\n" + "\nYour Breender Team\n",
    }
    transporter.sendMail(mailOptions);
}
export { getDocs, getProcessedDocs, verify, decline }
