import { Pet } from "../models/pet.model.js"
const getDocs = async (req, res) => {
    try {
        // get pet with id from database
        let docs = await Pet.aggregate([
            [
                {//add user to his pet
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'ownerId', 
                    'foreignField': '_id', 
                    'as': 'user'
                  }
                }, {//get only documents where user has a premium account
                  '$match': {
                    'user.subscriptionPlan': 'premium'
                  }
                }, {
                  '$project': {
                    'competitions': { //create field named competitions
                      '$filter': {
                        'input': '$competitions', // document array field called competitions
                        'as': 'item', //name every elem of array as item
                        'cond': {
                          '$ne': [ //not equal true
                            '$$item.certificate.verified', true //refers to variable called item,  declared above 
                          ]
                        }
                      }
                    }
                  }
                }, {
                  '$match': { //get only docs where competitions not empty
                    'competitions': {
                      '$ne': []
                    }
                  }
                }
              ]
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
        await Pet.updateOne({ "competitions.certificate._id": "60eb3359d1a60f716dd71f4c" }, { $set: { "competitions.$.certificate.verified": true } }).exec()
        // return updatet doc
        return res.status(200).json("Certificate verified")
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        })
    }
}
export { getDocs, verify }
