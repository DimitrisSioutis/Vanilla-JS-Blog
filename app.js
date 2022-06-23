if (process.env.NODE_ENV !== 'production') {require('dotenv').config()}
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const articleRouter = require('./routes/articles')
const mainRouter = require('./routes/main')
const playerRouter = require('./routes/players')
const methodOverride = require('method-override')  //enables us to use .delete
const connection = require('./models/database')

connection.on('open',()=>{
    console.log('Database Connected')
})

function errorHandler(err,req,res,next){
    if(err){
        res.send('<h1> Error <h1>')
        console.log(err)
    }
}

const app = express();

app.set("view engine", "ejs");
app.set('layout','layout')
app.use(express.urlencoded({extended: false}))  //gives access to body of the request (req.body)
app.use(expressLayouts)
app.use(express.json())
app.use(express.static(__dirname));
app.use(methodOverride('_method'))  //method to use DELETE
app.use('/',mainRouter); 
app.use('/articles', articleRouter); //method to use router from articles.js
app.use('/players', playerRouter); //method to use router from players.js
app.use(errorHandler); //we use a middleware to catch any error without cancelling our application

app.listen( process.env.PORT, () => {
    console.log(`server running on port: ${process.env.PORT}`);
})