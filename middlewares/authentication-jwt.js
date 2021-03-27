const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require('../models');
const Role = db.role;
const User = db.user;

let id;  // User Collection unique ID
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
        this.id = decoded.id;
        this.userRole = decoded.role;

        req.body.id = decoded.id;
        req.body.userRole = decoded.role;        

        next();
    })
}

isAdmin = (req, res, next) => {
    console.log('Verified User is-->', this.id);
    console.log('Verified User Role is-->', this.userRole);
    User.find({_id: this.id}).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err, status: 0});
            return;
        }
        console.log('User is-->', user);
        console.log('User Role is-->', user[0].role);

        if(user[0].role === 'level2') {
            console.log('User has Level2 Access..');
            next();
            return;
        }

        res.status(403).send({message: 'Required Admin Role!', status: 0});
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
    return this.id;
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


