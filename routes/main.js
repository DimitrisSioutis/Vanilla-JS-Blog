const main = require('express').Router();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connection = require('../models/database');
const Article = connection.models.Article;
const User = connection.models.User;
const Player = connection.models.Player;

main.use(session({                                                          // http://expressjs.com/en/resources/middleware/session.html
    secret: process.env.SECRET,
    resave: false,                                                          // don't save session if unmodified
    saveUninitialized: true,                                                // don't create session until something stored
    store: MongoStore.create({mongoUrl:process.env.DATABASE_URL}),          // where to save the session
    
}))

const isAuth= (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('login')
    }
}

main.get("/", async(req, res) => {
    const articles =  await Article.find().sort({ createdAt: 'desc' }) //method to load all articles , desc : descending order , loads the newest articles 1st
    res.render('pages/index', {articles: articles });
});

main.post("/search", async(req,res) => {
    const keyword = req.body.input
    console.log(keyword)
    const articles = await Article.find({ title: {$regex: new RegExp(keyword+'.*','i')}})
    if (articles.length < 1){
        articles[0] = {title:"Oops,nothing Found" }
    }
    res.render('pages/search',{articles: articles})
})

main.get("/news", async(req, res) => {
    const articles =  await Article.find().sort({ createdAt: 'desc' }) 
    res.render('articles/news', {articles: articles});
});

main.get("/team", async(req, res) => {
    const players =  await Player.find()
    res.render("players/roster",{players: players});
});

main.get("/contactus", (req, res) => {
    res.render("pages/contactus");
});

main.post('/getArticles',async (req,res)=>{
    let input = req.body.input.trim(); //.trim removes spaces
    let search = await Article.find({ title: {$regex: new RegExp(input+'.*','i')}}).exec(); //we use regex to search for articles that containt the input the user send
    res.send({input: search});
})

main.get('/login', async(req, res)=>{
    if(req.session.isAuth){
       return res.redirect('/dashboard')
    }
    res.render("pages/login")
});

main.post("/login", async(req,res)=>{
    const user = {username: req.body.username, password: req.body.password}
    existingUser = await User.findOne({username: user.username})

    if(existingUser){
        if(existingUser.password === user.password){
            req.session.isAuth = true;
            return res.redirect('/dashboard')
        }
        res.redirect('/login')
    }
    res.redirect('/login')
});

main.get("/dashboard",isAuth, async(req, res) => {  //we use isAuth function-middleware to see if the user is authenticated to grant them access to this admin only page
    const articles =  await Article.find().sort({ createdAt: 'desc' })
    const players =  await Player.find().sort({ createdAt: 'desc' })
    res.render('pages/dashboard', {articles: articles , players: players});
});

main.delete('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err) throw err
        res.redirect('/login')
    })  
})


module.exports = main;