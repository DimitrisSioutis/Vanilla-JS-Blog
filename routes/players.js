const playerRouter = require('express').Router();
const connection = require('../models/database')
const Player = connection.models.Player


playerRouter.get('/add-player', (req, res) => {
    res.render('players/add-player', {player: new Player()})
})

playerRouter.get('/edit/:id', async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('players/edit-player', {player: player})
})

playerRouter.get('/:slug', async (req, res) => {
    const player = await Player.findOne({    //we use findOne instead of find cause we need one particular player
        slug: req.params.slug
    })
    if (player== null) res.redirect('/roster')  //if the slug doesnt exist ,user is redirected to the news page
    res.render('players/show-player', {player: player})
})

playerRouter.post('/', async (req, res, next) => {
    req.player = new Player()
    next()
}, savePlayerAndRedirect('add-player'))

playerRouter.put('/:id', async (req, res, next) => {
    req.player = await Player.findById(req.params.id)
    next()
}, savePlayerAndRedirect('edit'))

playerRouter.delete('/:id', async (req, res) => {
    await Player.findByIdAndDelete(req.params.id)
    res.redirect('/roster')  //once you delete,returns to news
})

function savePlayerAndRedirect(path) {
    return async (req, res) => {
        let player = req.player        //instead of creating a new player ,we are using the player of the request in case we want to edit instead of creating a new playerRouter 
        player.firstname = req.body.firstname
        player.lastname = req.body.lastname
        player.number = req.body.number
        player.image= req.body.image
        player.birthday = req.body.birthday
        player.appearances = req.body.appearances
        player.goals = req.body.goals
        player.position = req.body.position
        try {
            player= await player.save()
            console.log('saved')
            res.redirect(`/players/${player.slug}`)  //once playerRouter is saved the user gets redirected to the new playerRouter
        } catch (e) {
            console.log(e)
            res.render(`players/${path}`, {
                player: player                      
            } )
        }
    }
}

module.exports = playerRouter;