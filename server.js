const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const routes = require('./routes/users');
const app = express();

// passport files
require('./passport/passport-local');
require('./passport/passport-facebook');
require('./passport/passport-google');


// connect database
    mongoose.connect('mongodb://rohit:12345@ds229458.mlab.com:29458/ed-chat');
    mongoose.connection.on('connected',() => {
    console.log("Database Connected");
    });
    mongoose.connection.on('error',() => {
      console.log("Trouble Connecting to Database");
    });


// listen to server
    const server = http.createServer(app);
    server.listen(3000 ,function(){
      console.log("Server Listening on PORT 3000 ");
    });


// views
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine','ejs');


// static folder
    app.use(express.static('public'));

// Parsers
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


// express validator
    app.use(validator());


// set session
    app.use(session({
      secret : 'thisisasecretkey',
      resave : true,
      saveUninitialized : true,
      store : new MongoStore({mongooseConnection : mongoose.connection})
    }));


// connect-flash
    app.use(flash());


// initialize passport
    app.use(passport.initialize());
    app.use(passport.session());


// define routes
    app.use('/',routes);
