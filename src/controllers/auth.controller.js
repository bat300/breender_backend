import jsonwebtoken from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { JwtSecret } from "../config.js"
import User from "../models/user.model.js"

const login = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (!Object.prototype.hasOwnProperty.call(req.body, "password"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a password property",
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a username property",
        });

    // handle the request
    try {
        // get the user form the database
        let user = await User.findOne({
            username: req.body.username,
        }).exec();

        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!isPasswordValid) return res.status(401).send({ token: null });

        // if user is found and password is valid
        // create a token
        const token = jsonwebtoken.sign(
            { _id: user._id, username: user.username, role: user.role },
            JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        return res.status(200).json({
            token: token,
        });
    } catch (err) {
        return res.status(404).json({
            error: "User Not Found",
            message: err.message,
        });
    }
};

const register = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (!Object.prototype.hasOwnProperty.call(req.body, "password"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a password property",
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a username property",
        });

    // handle the request
    try {
        // hash the password before storing it in the database
        const salt = bcrypt.genSaltSync(8);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // create a user object
        const userData = {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.isAdmin ? "admin" : "member",
            email: req.body.email,
            city: req.body.city


        };

        // create the user in the database
        let retUser = await User.create(userData);

        // if user is registered without errors
        // create a token
        const token = jsonwebtoken.sign(
            {
                _id: retUser._id,
                username: retUser.username,
                role: retUser.role,
            },
            JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        var transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: "breenderseba@gmail.com", 
                pass: "breenderTeamSEBA2021" 
            }
        });
        //send an email with verification link containing email and token
                var mailOptions = { from: 'breenderseba@gmail.com', to: retUser.email, subject: 'Account Verification Link', text: 'Hello '+ retUser.username +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/confirmation\/' + retUser.email + '\/' + token + '\n\nThank You!\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { 
                        return res.status(500).send({msg: err});
                     }
                    return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                });

        // return generated token
        res.status(200).json({
            token: token,
        });

    } catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({
                error: "User exists",
                message: err.message,
            });
        } else {
            return res.status(500).json({
                error: "Internal server error",
                message: err.message,
            });
        }
    }
};

const confirmEmail = async (req, res) => {
    const decodedToken = jsonwebtoken.decode(req.params.token, {complete: true}); //decode token 
    const _id = decodedToken.payload._id; 
    //extract id from token 
    User.findOne({ _id: _id }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token){
            console.log("no token")
            return res.status(400).json({error: 'Link Expired', message:'Your verification link may have expired.'});
        }
        // if token is found then check valid user 
        else{
            User.findOne({ _id: _id, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user){
                    return res.status(401).json({error: 'User Not Found', message:'We were unable to find an account for this verification. Please SignUp!'});
                } 
                // user is already verified
                else if (user.isVerified){
        
                    return res.status(200).json({message: 'Your account has been already verified'});
                    
                }
                // verify user
                else{
                    console.log(user)
                    user.isVerified = true;
                    user.save(function (err) {
                        if(err){
                            return res.status(500).json({message: err.message});
                        }
                        // account successfully verified
                        else{
                          return res.status(200).json({message: 'Your account has been successfully verified'});
                        }
                    });
                }
            });
        }
        
    });
};

const me = async (req, res) => {
    try {
        // get own user name from database
        let user = await User.findById(req.userId).select("username").exec()

        if (!user)
            return res.status(404).json({
                error: "Not Found",
                message: `User not found`,
            });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        });
    }
};

const logout = (req, res) => {
    res.status(200).send({ token: null });
};

export {
    login,
    register,
    logout,
    me,
    confirmEmail
};