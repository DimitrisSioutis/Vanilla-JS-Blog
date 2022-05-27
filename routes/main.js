const express = require('express');
const Article = require("../models/articles_db");
const main = express.Router();

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
    const articles =  await Article.find().sort({ createdAt: 'desc' }) //method to load all articles
    res.render('articles/news', {
        articles: articles
    });
});

main.get("/contactus", (req, res) => {
    res.render("pages/contactus");
});

main.get("/schedule", (req, res) => {
    res.render("pages/schedule");
});

main.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

main.post('/getArticles',async (req,res)=>{
    let payload = req.body.payload.trim();
    let search = await Article.find({ title: {$regex: new RegExp('^'+payload+'.*','i')}}).exec();
    res.send({payload: search});
})

module.exports = main;