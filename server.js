'use strict'

// require express and bodyParser
const  express = require("express");
const  bodyParser = require("body-parser");
const path = require('path');
const http = require('http');
const session = require('express-session');
const flash = require('connect-flash');
var cookieParser = require("cookie-parser");
var morgan = require("morgan");


// Import DB Connection
require("./config/db");
const rateLimit = require('express-rate-limit');



// Rate limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


// Import API route
var routes = require('./api/routes/movieRoutes'); //importing route
var user_routes = require('./api/routes/userRoutes');

// create express app
const  app = express();
app.use(express.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');


// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

//// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

app.use(
  session({
    key: "user_sid",
    secret:'secretid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    }
  })
);


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});



app.use(flash());

app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    req.flash('success', "Hello");
    res.redirect("/home");
  } else {
    next();
  }
};


// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

app.get('/login', sessionChecker, function(req,res){
  res.render('login');
});

app.get('/signup', sessionChecker, function(req,res){
    res.render('signup_copy');
  });




app.get("/home", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      let name = req.session.user.UserName;
      res.render('home', {username: name});
    } else {
      res.redirect("/login");
    }
});

app.get("/profile", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    let name = req.session.user.UserName;
    res.render('profile', {username: name});
  } else {
    res.redirect("/login");
  }
});

app.get("/delete", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    let name = req.session.user.UserName;
    res.render('delete', {username: name});
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(limiter)


routes(app);
user_routes(app)



// define port to run express app
const  port = process.env.PORT || 3000;

// use bodyParser middleware on express app

const server = http.createServer(app);
// Listen to server
server.listen(port, () => {

console.log(`Server running at http://localhost:${port}`);
});

