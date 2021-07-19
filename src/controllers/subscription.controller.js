import User from "../models/user.model.js"
import nodemailer from "nodemailer"

const updateUser = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        })
    }

    // handle the request
    try {

        let startDate = new Date();

        // find and update movie with id
          await User.findByIdAndUpdate({ "_id": req.body.id}, { "$set": { "subscriptionPlan": req.body.subscriptionPlan, "paymentPlan": req.body.paymentPlan, "paymentMethod": req.body.paymentMethod, "startDate": startDate}}, {
            new: true,
            runValidators: true,
        }).exec()

        return res.status(200).json("User updated")
        //token is atomatically invalidated
        
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        })
    }
}

const sendReminderEmail = async (user) => {
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
        subject: "Sad to see you go",
        text: "Hello " + user.username + ",\n\n" + "Your Premium subscription ends tommorow. You'll lose your access to all premium features. But don't worry: you can gain it back by switching from the Free plan to the Premium one!" + "\n\nThank You,\n" + "\nYour Breender Team\n",
    }
    transporter.sendMail(mailOptions);
}

const checkPlanStatus = async (id)  => {
    let user = await User.findById(id).exec();
    let currentDate = new Date();
    
    if(user.subscriptionPlan === "premium" && user.startDate) {

    if (user.endDate.getDate() - currentDate.getDate() === 1 && currentDate.getMonth() === user.endDate.getMonth() && currentDate.getFullYear() === user.endDate.getFullYear() && !user.subscriptionReminderSent) { // check if there is one day left for the premium subscription and send an email
        console.log("hi");
        
        let updatedUser = await User.findByIdAndUpdate({ "_id": id}, { "$set": {"subscriptionReminderSent" : true}}, {
            new: true,
            runValidators: true,
        }).exec();
        await sendReminderEmail(updatedUser);
    
    } else if(currentDate.getDate() >= user.endDate.getDate() && currentDate.getMonth() >= user.endDate.getMonth() && currentDate.getFullYear() >= user.endDate.getFullYear()) { //check if end date of plan already happened
         await User.findByIdAndUpdate({ "_id": id}, { "$set": { "subscriptionPlan": "free", "paymentPlan": "none", "startDate": undefined, "subscriptionReminderSent" : false}}, {
            new: true,
            runValidators: true,
        }).exec();
    
    }}

}

export {updateUser, checkPlanStatus}