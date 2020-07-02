const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require('../models');
const Role = db.role;
const User = db.user;

let userId;  // User Email
let userRole;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if(!token) {
        return res.status(403).send({message: 'No token found!'});
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) {
            return res.status(403).send({message: 'Unauthorised!'});
        }
        this.userId = decoded.id;
        this.userRole = decoded.role;

        req.body.userEmail = decoded.id;
        req.body.userRole = decoded.role;
        

        next();
    })
}

isAdmin = (req, res, next) => {
    console.log('Verified User is-->', this.userId);
    console.log('Verified User Role is-->', this.userRole);
    User.find({email: this.userId}).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        console.log('User is-->', user);
        console.log('User Role is-->', user[0].role);

        if(user[0].role === 'level2') {
            console.log('User has Level2 Access..');
            next();
            return;
        }

        res.status(403).send({message: 'Required Admin Role!'});
        return;

    });
}

/* isManager = (req, res, next) => {
    User.findById(req.UserId).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        if(user.role === 'manager') {
            next();
            return;
        }

        res.status(403).send({message: 'Required Manager Role!'});
        return;

    });
} */


/* getUserIdFromToken = (token) => {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        return decoded.id;
    });
};

getUserRoleFromToken = (token) => {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        return decoded.role;
    });
};

getUserIdFromToken = () => {
    return this.userId;
};

getUserRoleFromToken = () => {
    return this.userRole;
}; */


const authenticationJWT = {
    verifyToken,
    isAdmin,
//    getUserIdFromToken,
  //  getUserRoleFromToken
  //  isManager
}

module.exports = authenticationJWT;


