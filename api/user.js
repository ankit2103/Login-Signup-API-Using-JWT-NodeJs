const express = require('express');
const router = express.Router();
const User = require('../models/users');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

router.post('/register', (req, res, next) => {
    const userName = req.body.userName
    const password = req.body.password
    const phone = req.body.phone
    const email = req.body.email
    const userType = req.body.userType
    let count = 0

    bcrypt.hash(password, 10, (err, hash) => {
        if (hash) {

            User.find({ Email: email })
                .exec().then(result => {
                    if (result.length == 0) {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            UserName: userName,
                            Password: hash,
                            Phone: phone,
                            Email: email,
                            UserType: userType
                        })

                        user.save()
                            .then(result => {
                                return res.status(200).json({
                                    code: "200",
                                    status: "success",
                                    message: "Register Successfully"
                                })
                            })
                            .catch(err => {
                                return res.status(200).json({
                                    code: "201",
                                    status: "fail",
                                    message: "Something went wrong"
                                })
                            })

                    } else {
                        return res.status(200).json({
                            code: "201",
                            status: "alreadyexist",
                            message: "Email already exist"
                        })
                    }
                })
        } else {
            return res.status(200).json({
                code: "201",
                status: "fail",
                message: "Something went wrong"
            })
        }
    })
})


router.post('/login', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.find({ Email: email })
        .exec().then(user => {
            if (user.length >= 1) {
                bcrypt.compare(password, user[0].Password, (err, result) => {
                    if (result) {
                        const token = JWT.sign({
                            userName: user[0].UserName,
                            userType: user[0].UserType,
                            email: user[0].Email
                        },
                            'Login-Signup', {
                            expiresIn: "24h"
                        }
                        );
                        return res.status(200).json({
                            code: "200",
                            status: "success",
                            userName: user[0].UserName,
                            email: user[0].Email,
                            type: user[0].UserType,
                            token: token
                        })
                    } else {
                        return res.status(200).json({
                            code: "201",
                            status: "invalidcredential",
                            message: "Invalid password"
                        })
                    }
                })
            } else {
                return res.status(200).json({
                    code: "201",
                    status: "notfound",
                    message: "User not exist",
                })
            }
        }).catch(err => {
            return res.status(200).json({
                code: "201",
                status: "fail",
                message: "Something went wrong"
            })
        })
})




module.exports = router; 