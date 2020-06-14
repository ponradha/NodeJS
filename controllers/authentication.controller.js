const authConfig = require('../config/auth.config');
const DB = require('../models');

const Role = DB.role;
const User = DB.user;

var JWT = require('jsonwebtoken');

exports.signup = (req, res) => {
    console.log('Gonna Signup -->', req.body);
    const roleStr = 'level1';
    const user = new User({
        name: req.body.uName,
        email: req.body.uMail,
        password: req.body.password, 
        age: req.body.uAge,
        mobileno: req.body.uMobile,
        pan: req.body.uPAN,
        hobbies: req.body.uHobbies,
        gender: req.body.uGender,
        role: roleStr
    });

    user.save((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
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

