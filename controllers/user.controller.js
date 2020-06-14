const DB = require('../models');
const { getUserIdFromToken } = require('../middlewares');

const jwt = require('jsonwebtoken');  // RK -temporary
const authConfig = require('../config/auth.config');

const User = DB.user;


exports.getUser = (req, res) => {
    let token = req.headers['x-access-token'];
    console.log('Gonna getUser() -->', req.body);
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) {
            return res.status(403).send({message: 'Unauthorised!'});
        }
        const userEmail = decoded.id;
        console.log('userEmail **** -->', userEmail);
        User.find({ email: userEmail }, 'name email mobileno gender age pan hobbies')
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
    
            res.status(200).send(user);
        });
    });
}


exports.getUsersList = (req, res) => {
    console.log('Gonna getUserList() -->', req.body);
    User.find({}, 'name email mobileno gender age pan hobbies')
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
        console.log('GONNA SEND RESPONSE');
        res.status(200).send(user);
    });
}



/* 
exports.userDashboard = (req, res) => {
    res.status(200).send('User content');
}

exports.managerDashboard = (req, res) => {
    res.status(200).send('Manager content');
}

exports.adminDashboard = (req, res) => {
    res.status(200).send('Admin content');
} */