const express = require('express');
const Article = require("../models/articles_db");
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', {
        article: new Article()
    })
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {
        article: article
    })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({    //we use findOne instead of find cause we need one particular article
        slug: req.params.slug
    })
    if (article == null) res.redirect('/news')  //if the slug doesnt exist ,user is redirected to the news page
    res.render('articles/show', {
        article: article
    })
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/news')  //once you delete,returns to news
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article           //instead of creating a new article ,we are using the article of the request in case we want to edit instead of creating a new article 
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.image= req.body.image
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)  //once article is saved the user gets redirected to the new article
        } catch (e) {
            res.render(`articles/${path}`, {
                article: article                       
            } )
        }
    }
}

module.exports = router;