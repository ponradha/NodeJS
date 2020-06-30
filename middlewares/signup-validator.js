const db = require('../models');

const ROLES = db.ROLES;

const User = db.user;

validateInput = (req, res, next) => {
    console.log('Validating registeration Inputs');
    const mailRegex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    const mobileRegex = new RegExp(/^((\+91)?|(91)?|(0)?)([6-9]{1})([0-9]{9})$/);
    const PanNoRegex = new RegExp(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    const gender = req.body.uGender;
    
    if(req.body.uName.length < 2) {
        res.status(500).send({message: 'User Name is too short.'});
        return;
    } else if (!mailRegex.test(req.body.uMail)) {
        res.status(500).send({message: 'Email is not valid.'});
        return;
    } else if (!mobileRegex.test(req.body.uMobile)) {
        res.status(500).send({message: 'Mobile no is not valid.'});
        return;
    } else if (!PanNoRegex.test(req.body.uPAN)) {
        res.status(500).send({message: 'PAN no is not valid.'});
        return;
    } else if (req.body.uHobbies.split(',').length < 2) {
        res.status(500).send({message: 'Minimum 2 hobbies are required.'});
        return;
    } else if (req.body.password.length < 20) {
        res.status(500).send({message: 'Password is not valid.'});
        return;
    } 


    if (gender === 'm' || gender === 'f' || gender === 'o') {
        console.log('Valid Gender...');
    } else {
        res.status(500).send({message: 'Gender is not valid'});
        return;
    }

    User.findOne({email: req.body.uMail})
    .exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        console.log('USer is-->', user);
        if(user) {
            res.status(400).send({message: 'Failed! user already exists'});
            return;
        }
        console.log('SHOULD NOT COME HERE');
        next();
    })
};


const signupValidator = {
    validateInput
}

module.exports = signupValidator;