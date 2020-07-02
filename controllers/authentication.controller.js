const authConfig = require('../config/auth.config');
const DB = require('../models');

const Role = DB.role;
const User = DB.user;
const SMTPpassword = process.env.SMTP_EMAIL_PASSWORD || authConfig.emailPassword;

var JWT = require('jsonwebtoken');

const nodeMailer = require('nodemailer');
const passwordGenerator = require('generate-password');
const CryptoJS = require('crypto-js');

exports.signup = (req, res) => {
    console.log('Gonna Signup -->', req.body);
    const roleStr = 'level1';
    const dateStr = new Date().toLocaleString();
    const user = new User({
        name: req.body.uName,
        email: req.body.uMail,
        password: req.body.password, 
        age: req.body.uAge,
        mobileno: req.body.uMobile,
        pan: req.body.uPAN,
        hobbies: req.body.uHobbies,
        gender: req.body.uGender,
        role: roleStr,
        createdDate: dateStr
    });

    user.save((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(500).send({message: 'Could not register the register. Check with the admin'});
        }

        res.send({message: 'User is Registered Successfully!'});
    });
}

exports.signin = (req, res) => {
    console.log('Gonna Signin -->', req.body);
    User.findOne({
        email: req.body.email
    })
    .exec((err, user) => {
        console.log('User--->', user);
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(404).send({message: 'User Not found'});
            return;
        }

        if(user.password !== req.body.pwd) {
            res.status(401).send({message: 'Invalid password'});
            return;
        }

        var token = JWT.sign({id: user.email, role: user.role}, authConfig.secret, {expiresIn: 10000});

        res.status(200).send({
            accessToken: token,
            role: user.role,
            email: user.email
        });
    });
}

exports.resetPassword = (req, res) => {
    console.log('Gonna resetPassword -->', req.body);
    const mailRegex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);

    if (!mailRegex.test(req.body.uMail)) {
        res.status(500).send({message: 'Email is not valid.'});
        return;
    }

    User.findOne({
        email: req.body.uMail
    })
    .exec((err, user) => {
        console.log('User--->', user);
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(404).send({message: 'User Not found'});
            return;
        }

        if(user.email === req.body.uMail) {

            console.log('RESET 000000');

            const newPassword = passwordGenerator.generate({
                length: 10,
                numbers: true,
                strict: true
            });

            console.log('newPassword  is--', newPassword);

            const hashedPassword = CryptoJS.SHA256(newPassword).toString();
            
            console.log('hashedPassword  is--', hashedPassword);

            User.findOneAndUpdate({email: req.body.uMail}, {password: hashedPassword}, (err, user) => {
                if(err) {
                    res.status(500).send({message: 'Could not reset password, ' + err});
                    return;
                }

                console.log('User issssss-->', user);

            })
            
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: authConfig.senderEmail,
                    pass: SMTPpassword
                }
            });

            let mailOptions = {
                from: authConfig.senderEmail,
                to: req.body.uMail,
                subject: 'RESET PASSWORD - ROBOTO',
                text: `Your password has been reset and the new password is ${newPassword}. Try logging in with your new password.`
            };

            transporter.sendMail(mailOptions, (error, success) => {
                if(err) {
                    console.log('Error...Could not send email');
                    res.status(500).send({message: 'Could not reset password, ' + err});
                    return;
                } else {
                    console.log('MAil sent...', success);
                }
            });


            res.status(200).send({message: 'Your password has been reset and the new password has been sent your registered email. Try logging in with your new password.'});
            return;
        }


    });
}
