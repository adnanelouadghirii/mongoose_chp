module.exports = function(app) {
    var user = require('../controllers/userController');
    app
        .route("/users/signup")
        .post(user.createNewUser);
    app
        .route("/users/login")
        .post(user.login);
    
    app
        .route("/users/delete")
        .post(user.delete);
    }
    

    