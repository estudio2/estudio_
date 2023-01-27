const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

const app = express();
require('./database');
require('./passport/local-auth');

//Settings

app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.set('view engine', 'ejs');



//Middlewares


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Global variables
app.use((req, res, next) => {
    res.locals.succes_msg = (req.flash('succes_msg'));
    res.locals.error_msg = (req.flash('error_msg'));
    app.locals.user = req.user;
    res.locals.noMostrarVolver = req.noMostrarVolver;
    next();
})


// Routes
app.use(require('./routes/info'));
app.use(require('./routes/usuarios'));
app.use(require('./routes/carpetas'));



app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
    console.log('Listening');
});