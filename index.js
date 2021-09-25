require('dotenv').config();
const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const dbConnection = require('./database')
const flash = require('connect-flash')
const passport = require('passport');

//Inicialitiations
const app = express();
dbConnection() //Base de Datos
require('./src/config/passport')


//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './src/views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join( app.get('views'), 'layouts' ),
    partialsDir: path.join( app.get('views'), 'partials' ),
    extname: '.hbs'
}))
app.set('view engine', '.hbs');

//Midlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'thesecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

//Routes
app.use( require('./src/routes') )
app.use( require('./src/routes/notes') )
app.use( require('./src/routes/users') )

//Static Files
app.use(express.static( path.join(__dirname, './src/public') ))

app.listen( app.get('port') ,() => {
    console.log('Server on port:', app.get('port'))
})