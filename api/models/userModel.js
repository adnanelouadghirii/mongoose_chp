'use strict';
// Import mongoose
    const mongoose = require("mongoose");

// Declare schema and assign Schema class
    const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
    const UserSchema = new Schema({
        UserName: {
            type:String,
            required:true,
            unique: [true, "UserName Taken"]
        },
        Password:{
            type:String,
            required:true
        }
    });

   

// create and export model
module.exports = mongoose.model("UserSchema", UserSchema);