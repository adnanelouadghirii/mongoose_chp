'use strict';
// Import mongoose
    const mongoose = require("mongoose");

// Declare schema and assign Schema class
    const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
    const MovieSchema = new Schema({
        name: {
            type:String,
            required:true
        },
        trailer_link:{
            type:String,
            required:true
        },
        description: {
            type:String,
            required:true
        },
        link: {
            type:String,
            required:true
        },
        release_date: {
            type:Date,
            required:true
        },
        poster_link: {
            type:String,
            required:true
        }
    });

// create and export model
module.exports = mongoose.model("MovieSchema", MovieSchema);