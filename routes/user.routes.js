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

    app.get('/api/users/:id', [authenticationJWT.verifyToken], userController.getUser);
/*     app.get('/api/users', [authenticationJWT.verifyToken], userController.managerDashboard); */
    /* app.get('/api/users', [authenticationJWT.verifyToken], userController.adminDashboard); */
    app.get('/api/users', [authenticationJWT.verifyToken, authenticationJWT.isAdmin], userController.getUsersList);
    app.post('/api/users', [authenticationJWT.verifyToken], userController.createNewUser);
    app.put('/api/users/:id', [authenticationJWT.verifyToken], userController.updateUserDetails);
    app.delete('/api/users/:id', [authenticationJWT.verifyToken, authenticationJWT.isAdmin], userController.deleteUser);
    app.post('/api/users/:id/changepassword', [authenticationJWT.verifyToken], userController.changePassword);
    app.post('/api/users/:id/updateprofile', [authenticationJWT.verifyToken], userController.updateUserProfile);
}