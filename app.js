if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts")
const articleRouter = require('./routes/articles')
const mainRouter = require('./routes/main')

const mongoose = require('mongoose');
const Article = require('./models/database')
const Users = require('./models/users')

const methodOverride = require('method-override')
const passport = require("passport");
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config');

initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

const users = []

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
} )

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}))
app.set('layout','layout')
app.use(expressLayouts)
app.use(express.json())
app.use(express.static(__dirname));
app.use(methodOverride('_method'))  //method to use DELETE
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/',mainRouter); 
app.use('/articles', articleRouter); //method to use router from articles.js

app.listen( process.env.PORT || port, () => {
    console.log(`server running on port: ${port}`);
})

app.get("/dashboard",checkAuthenticated, async(req, res) => {
    const articles =  await Article.find().sort({ createdAt: 'desc' }) //method to load all articles
    res.render('pages/dashboard', {articles: articles , name: req.user.username});
});

app.get('/login',checkNotAuthenticated, async(req, res)=>{
    const array = await Users.find()
    res.render("pages/login"),array.forEach(user => users.push(user))
});

app.post("/login",checkNotAuthenticated, passport.authenticate
('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true})
);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
}
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard')
    }
    next()
}