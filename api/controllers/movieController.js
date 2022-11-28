const  Movie = require("../models/movieModel");

exports.createNewMovie = (req, res) => {
    console.log(req.body)
    let  newMovie = new Movie (req.body);
    newMovie.save((err, todo) => {
    if (err) {
    res.status(500).send(err);
    }
    res.status(201).json(todo);
    });
    };