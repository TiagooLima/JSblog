const express = require('express')
const db = require('../db')
const router = express.Router()

router.get('/', (req, res) => {
    if(req.session.usuario){
        res.render('minha-conta', {minhaconta:true, classe: 'principal'})
    } else {
        res.redirect('/login')
    }
})

router.get('/favoritos', (req, res) => {
    if(req.session.usuario){
        res.render('minha-conta', {favorito: true, classe: 'favoritos'})
    } else {
        res.redirect('/login')
    }
})

router.get('/config', (req, res) => {
    if(req.session.usuario){
        res.render('minha-conta', {config: true, classe: 'config'})
    } else {
        res.redirect('/login')
    }
})

module.exports = router