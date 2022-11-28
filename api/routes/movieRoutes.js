module.exports = function(app) {
    var todoList = require('../controllers/movieController');

    app
        .route("/movies")
        .post(todoList.createNewMovie);
    }