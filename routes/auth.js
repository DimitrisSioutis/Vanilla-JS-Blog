const auth = require('express').Router();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connection = require('../models/database');
const Article = connection.models.Article;
const User = connection.models.User;
const Player = connection.models.Player;

auth.use(session({                                                          // http://expressjs.com/en/resources/middleware/session.html
    secret: process.env.SECRET,
    resave: false,                                                          // don't save session if unmodified
    saveUninitialized: true,                                                // don't create session until something stored
    store: MongoStore.create({mongoUrl:'mongodb+srv://sioutis:dimitris123@cluster0.gn78i2u.mongodb.net/blog?retryWrites=true&w=majority'}),          // where to save the session   
}))

const isAuth= (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/admin/login')
    }
}

let message = ''

auth.get('/login', async(req, res)=>{
    
    if(req.session.isAuth){
       return res.redirect('/admin/dashboard')
    }
    res.render("pages/login", {message:message})
});

auth.post("/login", async(req,res)=>{
    const user = {username: req.body.username, password: req.body.password}
    existingUser = await User.findOne({username: user.username})

    if(existingUser){
        if(existingUser.password === user.password){
            req.session.isAuth = true;
            return res.redirect('/admin/dashboard')
        }else{
            message = 'wrong password'
            res.render('pages/login', {message:message})
        }    
    }else{
        message = 'wrong username';
        res.render('pages/login', {message:message})
    }
    message = '';
});

auth.get("/dashboard",isAuth, async(req, res) => {  //we use isAuth function-middleware to see if the user is authenticated to grant them access to this admin only page
    const articles =  await Article.find().sort({ createdAt: 'desc' })
    const players =  await Player.find().sort({ createdAt: 'desc' })
    res.render('pages/dashboard', {articles: articles , players: players});
});

auth.delete('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err) throw err
        res.redirect('/admin/login')
    })  
})


auth.get('/add-article',isAuth, (req, res) => {
    res.render('articles/new-article', {
        article: new Article()
    })
})

auth.get('/edit-article/:id',isAuth, async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit-article', {
        article: article
    })
})

auth.post('/add-article', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new-article'))

auth.put('/edit-article/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit-article'))

auth.delete('/delete-article/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/admin/dashboard')  //once you delete,returns to news
})

auth.get('/add-player',isAuth, (req, res) => {
    res.render('players/add-player', {player: new Player()})
})

auth.get('/edit-player/:id',isAuth, async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('players/edit-player', {player: player})
})

auth.post('/add-player', async (req, res, next) => {
    req.player = new Player()
    next()
}, savePlayerAndRedirect('add-player'))

auth.put('/edit-player/:id', async (req, res, next) => {
    req.player = await Player.findById(req.params.id)
    next()
}, savePlayerAndRedirect('edit-player'))

auth.delete('/delete-player/:id', async (req, res) => {
    await Player.findByIdAndDelete(req.params.id)
    res.redirect('/admin/dashboard')  //once you delete,returns to news
})


function savePlayerAndRedirect(path) {
    return async (req, res) => {
        let player = req.player        //instead of creating a new player ,we are using the player of the request in case we want to edit instead of creating a new auth 
        player.firstname = req.body.firstname
        player.lastname = req.body.lastname
        player.number = req.body.number
        player.image= req.body.image
        player.birthday = req.body.birthday
        player.appearances = req.body.appearances
        player.goals = req.body.goals
        player.position = req.body.position
        player.background = req.body.background
        try {
            player= await player.save()
            console.log(player)
            res.redirect(`/`)  
        } catch (e) {
            console.log(e)
            res.render(`players/${path}`, {
                player: player                      
            } )
        }
    }
}

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article           //instead of creating a new article ,we are using the article of the request in case we want to edit instead of creating a new article 
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.image= req.body.image
        try {
            article = await article.save()
            res.redirect(`/admin/dashboard`)  //once article is saved the user gets redirected to the new article
        } catch (e) {
            res.render(`admin/${path}`, {
                article: article                       
            } )
        }
    }
}



module.exports = auth;