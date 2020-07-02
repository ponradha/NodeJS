const { authenticationJWT } = require('../middlewares');
const userController = require('../controllers/user.controller');

module.exports = function(app) {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.get('/api/user', [authenticationJWT.verifyToken], userController.getUser);
/*     app.get('/api/users', [authenticationJWT.verifyToken], userController.managerDashboard); */
    /* app.get('/api/users', [authenticationJWT.verifyToken], userController.adminDashboard); */
    app.get('/api/users', [authenticationJWT.verifyToken, authenticationJWT.isAdmin], userController.getUsersList);
    app.post('/api/user/changepassword', [authenticationJWT.verifyToken], userController.changePassword);
    app.post('/api/user/updateprofile', [authenticationJWT.verifyToken], userController.updateUserProfile);
    app.post('/api/user', [authenticationJWT.verifyToken], userController.createNewUser);
    app.put('/api/user', [authenticationJWT.verifyToken], userController.updateUserDetails);
    app.delete('/api/user/:userID', [authenticationJWT.verifyToken, authenticationJWT.isAdmin], userController.deleteUser);
}