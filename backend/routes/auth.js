const express = require('express');
const router = express.Router(); 
const User = require('../models/User');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    }
})

// Route 1: SendOTP POST "/auth/sendotp"
router.post('/sendotp',[body('email', 'Enter a valid email').isEmail()], async (req,res) => {

    // If there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    const email = req.body.email;
    console.log("Recieved email request");
    try{
        const otp = crypto.randomInt(100000,999999).toString();
        // const expiration = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
        console.log("OTP generated");
        const msg = {
            to: email,
            from: 'bookmytimeslots@gmail.com',
            subject: 'Verify Email Address',
            text: `The generated OTP is ${otp}`,
        }
        transporter.sendMail(msg, function(error,info){
            if(error){
                console.log(error);
                res.status(500).send({ error: 'Failed to send OTP' });
            }
            else{
                console.log('Email sent:' + info.response);
                res.send({message: 'OTP sent successfully'});
            }
        })

        let user = await User.findOne({ email });
        if(!user){
            await User.create({email: email, otp:otp});
        }
        else{
            user.otp = otp;
            await user.save();
        }
        // console.log("Email sent");
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
    
})

// ROUTE 2: Verify Email Address
router.post('/verify',[body('email', 'Enter a valid email').isEmail()], async(req,res)=> {
    const email = req.body.email;
    const userOTP = req.body.otp;
    try{
        let user = await User.findOne({ email });
        if(!user){
            return res.status(401).send({ error: 'Invalid email' });
        }
        if (user.otp === userOTP) {
            user.otp = "";
            await user.save();
            res.send({ message: 'OTP verified' });
        } else {
            res.status(401).send({ error: 'Invalid OTP' });
        }
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})





module.exports = router;