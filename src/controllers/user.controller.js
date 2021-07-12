import User from "../models/user.model.js"

const read = async (req, res) => {
    try {
        // get user with id from database
        let user = await User.findById(req.params.id).exec()

        // if pet wasn't found, return 404
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

export { read }
