const { signupValidator } = require('../middlewares');
const authController = require('../controllers/authentication.controller');

module.exports = function(app) {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.post('/api/auth/signup', [signupValidator.validateInput], authController.signup);

    app.post('/api/auth/signin', authController.signin);
    app.post('/api/auth/forgotpassword', authController.resetPassword);
}