const express = require('express')
const router = express.Router()
const validator = require('validator')
const supabase = require('../db')
const bcrypt = require('bcrypt')
const { CLIENT_RENEG_LIMIT } = require('node:tls')


router.get('/', (req, res) => {
    res.render('cadastro')
})
router.post('/', async (req, res) => {
    const {nome, email, senha} = req.body
    
    if(!validator.isEmail(email)){
        return res.status(400).json({
            sucesso: false,
            message: 'E-mail inválido'
        })
    }

    const {data, err} = await supabase.from('usuarios').select('*').eq('email', email).single()
    if(err){
        return console.log(err);
    }
    console.log(data)
    if(data !== null){
        return res.status(400).json({
            sucesso: false,
            message: 'E-mail já vinculado à uma conta'
        })
    }

    if(senha.length<6){
        return res.status(400).json({
            sucesso: false,
            message: 'Senha fraca, faça uma mais forte'
        })
    }

    const hash = await bcrypt.hash(senha, 10)
    const {error} = await supabase.from('usuarios').insert({nome, email, senha: hash})
    if(error){
        return console.log(error)
    }
    
    return res.status(200).json({
        sucesso: true,
        message: 'Conta cadastrada'
    })


})

module.exports = router