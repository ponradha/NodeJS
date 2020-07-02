const DB = require('../models');
const { getUserIdFromToken } = require('../middlewares');
const CryptoJS = require('crypto-js');
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

exports.deleteUser = (req, res) => {
    console.log('Gonna Delete User -->', req);
    console.log(' req.params -->', req.params);
    User.findByIdAndRemove(req.params.userID, (err, user) => {
        console.log('User--->', user);
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(404).send({message: 'User could not be deleted.'});
            return;
        }
        console.log('GONNA SEND "DELETED" RESPONSE');
        res.status(200).send({message: 'User has been deleted successfully.'});
    });
}

exports.changePassword = (req, res) => {
    console.log('Gonna change password -->', req.body);
    User.findOneAndUpdate({email: req.body.userEmail, password: req.body.opwd}, {password: req.body.pwd}, (err, user) => {
        console.log('User--->', user);
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(404).send({message: 'Password could not be Changed.'});
            return;
        }
        console.log('GONNA SEND "CHANGE PASSWORD" RESPONSE');
        res.status(200).send({message: 'Password has been changed successfully.'});
    });
}

exports.updateUserProfile = (req, res) => {
    console.log('Gonna Update User Profile -->', req.body);
    const currDateStr = new Date().toLocaleString();
    User.findOneAndUpdate({_id: req.body._id}, 
        {
            mobileno: req.body.mobileNo,
            pan: req.body.PANNo,
            modifiedDate: currDateStr
        }, (err, user) => {
        console.log('User--->', user);
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(404).send({message: 'User Profile could not be updated.'});
            return;
        }
        console.log('GONNA SEND "UPDATE USER PROFILE" RESPONSE');
        res.status(200).send({message: 'User Profile has been updated successfully.'});
    });
}

exports.updateUserDetails = (req, res) => {
    console.log('Gonna Update User -->', req.body);
    const currDateStr = new Date().toLocaleString();
    User.findOneAndUpdate({_id: req.body._id}, 
        {
            name: req.body.uName,
            email: req.body.uMail,
            age: req.body.uAge,
            mobileno: req.body.uMobile,
            pan: req.body.uPAN,
            gender: req.body.uGender,
            createdDate: dateStr,
            modifiedDate: currDateStr
        }, (err, user) => {
        console.log('User--->', user);
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(!user) {
            res.status(404).send({message: 'User details could not be updated.'});
            return;
        }
        console.log('GONNA SEND "UPDATE USER DETAILS" RESPONSE');
        res.status(200).send({message: 'User details has been updated successfully.'});
    });
}

exports.createNewUser = (req, res) => {
    console.log('Gonna createNewUser -->', req.body);
    const roleStr = 'level1';
    const password = process.env.DEFAULT_USER_PASSWORD || authConfig.defaultUserPassword;
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const dateStr = new Date().toTimeString();
    const user = new User({
        name: req.body.uName,
        email: req.body.uMail,
        password: hashedPassword, 
        age: req.body.uAge,
        mobileno: req.body.uMobile,
        pan: req.body.uPAN,
        hobbies: '',
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
            res.status(500).send({message: 'Could not create the new user. Check with the admin'});
        }

        res.send({message: 'User is Created Successfully!'});
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