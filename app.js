if (process.env.NODE_ENV !== 'production') {require('dotenv').config()}
const express = require("express");
const expressLayouts = require("express-ejs-layouts")
const authRouter = require('./routes/auth')
const mainRouter = require('./routes/main')
const methodOverride = require('method-override')  //enables us to use .delete
const connection = require('./models/database')

connection.on('open',()=>{
    console.log('Database Connected')
})

function errorHandler(err,req,res,next){
    if(err){
        res.render('pages/error.ejs')
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
app.use('/admin',authRouter); 
app.use(errorHandler); //we use a middleware to catch any error without cancelling our application

app.listen( process.env.PORT || 8000), () => {
    console.log(`server running `);
})