const  User = require("../models/userModel");
var CryptoJS = require("crypto-js");
const  Movie = require("../models/movieModel");
const Joi = require("joi");
const flash = require('connect-flash');
var session = require("express-session");



exports.createNewUser = (req, res, next) => {
    try{
        const schema =Joi.object({ Password : Joi.string().min(3).required()});


    const result = schema.validate({Password: req.body.Password})
    let {error} = result
    if (error){
        req.flash('success', 'Password Must be more than 3 characters');
        res.redirect('/signup');
        return;
    }

    var enc_psd = CryptoJS.AES.encrypt(req.body.Password , 'secret key').toString();   // Encryption
    let  newUser = new User ({UserName: req.body.UserName, Password: enc_psd});
    newUser.save((err, person) => {
    if (err) {
        req.flash('success', 'UserName Already Taken');
        res.redirect('/signup');
        return;

    }
        req.session.user = person;
        res.redirect('/home');
    
    });
    }
    catch(error){
        return next(error)
    }
    };
exports.login = (req, res, next) => {
    try{
        var username = req.body.UserName;
        User.findOne({ 'UserName': username }, (err, person)=> {
            if (person== null){
                req.flash('success', 'UserName not found, please create an account');
                res.redirect('/login');
                return;
            }
            else if (person.Password != null){
            let enc = CryptoJS.AES.decrypt(person.Password, "secret key");
            decrypted = enc.toString(CryptoJS.enc.Latin1);
            }
            if (req.body.Password!=decrypted){
                req.flash('success', 'Password is incorrect!');
                res.redirect('/login');
                return
            }
            req.session.user = person;
            res.redirect('/home');

            console.log("Logged in successfully")
      });
    }catch(error){
        return next(error)
    }
    
    
    };
exports.delete = (req, res, next) => {
    try{
        var username = req.body.UserName;
        var found = false;
        User.findOne({ 'UserName': username }, (err, person)=> {
            if (person== null){
                req.flash('success', 'UserName not found, please create an account');
                res.redirect('/delete');
                return;
            }
            else if (person.Password != null){
                let enc = CryptoJS.AES.decrypt(person.Password, "secret key");
                decrypted = enc.toString(CryptoJS.enc.Latin1);
                if (req.body.Password!=decrypted){
                    req.flash('success', 'Password is incorrect!');
                    res.redirect('/delete');
                    return;
                }
            }
            
            found = true;

            console.log("User Found")

            User.deleteOne({ 'UserName': username }, (err, person)=> {
                if (err){                    req.flash('success', 'Error');
                    res.redirect('/delete');
                    return;
                }
                res.clearCookie("user_sid");
                console.log("User Deleted");
                res.redirect('/login')
                
    
            })

      });
    }catch(error){
        return next(error)
    }
    
    
    };