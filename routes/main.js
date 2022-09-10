const main = require('express').Router();
const connection = require('../models/database');
const Article = connection.models.Article;
const Player = connection.models.Player;

main.get("/", async(req, res) => {
    const articles =  await Article.find().sort({ createdAt: 'desc' }) //method to load all articles , desc : descending order , loads the newest articles 1st
    res.render('pages/index', {articles: articles });
});

main.post("/search", async(req,res) => {
    const keyword = req.body.input
    console.log(keyword)
    const articles = await Article.find({ title: {$regex: new RegExp(keyword+'.*','i')}})
    res.render('pages/search',{articles: articles})
    
})

main.get("/history", async(req, res) => {   
    res.render('pages/history')
})

main.get("/news", async(req, res) => {
    const articles =  await Article.find().sort({ createdAt: 'desc' })
    const dates = []
    articles.forEach(article =>{                    /* we create an array with the date sliced for 0,10 which gives us output like : 2022-1-1  */
        /* article.createdAt.toString().slice(0,15)  output is : Sun Jul 18 2022*/
        dates.push(article.createdAt.toString().slice(0,15))   /* we slice cause we want to keep only the day an article was created,not exact moment */
    })

    const uniqueDates = [...new Set(dates)];  /* we eliminate any duplicates with the new Set function */
    res.render('articles/news', {articles: articles , uniqueDates: uniqueDates});
});

main.get("/contactus", (req, res) => {
    res.render("pages/contactus");
});

main.post('/getArticles',async (req,res)=>{
    let input = req.body.input.trim(); //.trim removes spaces
    let search = await Article.find({ title: {$regex: new RegExp(input+'.*','i')}}).exec(); //we use regex to search for articles that containt the input the user send
    res.send({input: search});
})

main.get("/team", async(req, res) => {
    const players =  await Player.find()
    res.render("players/team",{players: players});
});

main.get('/article/:slug', async (req, res) => {
    const article = await Article.findOne({    //we use findOne instead of find cause we need one particular article
        slug: req.params.slug
    })
    const articles = await Article.find()
    if (article == null) res.redirect('/news')  //if the slug doesnt exist ,user is redirected to the news page
    res.render('articles/show-article', {article: article ,articles:articles})
})

main.get('/team/:slug', async (req, res) => {
    const player = await Player.findOne({    
        slug: req.params.slug
    })
    if (player== null) res.redirect('/roster')  
    res.render('players/show-player', {player: player})
})



module.exports = main;