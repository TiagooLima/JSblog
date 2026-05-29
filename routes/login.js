const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const supabase = require('../db')

router.get('/', (req,res) => {
    res.render('login')
})
router.post('/', async (req, res) => {
    const {email, senha} = req.body

    const {data,err} = await supabase.from('usuarios').select('*').eq('email', email)
    if(err){
        console.log(err)
    }
    if(data[0]===null || data[0]===undefined){
        return res.status(400).json({
            sucesso:false,
            message:'Usuário Inválido 1'
        })
    }

    //comparação de senha
    const compare = await bcrypt.compare(senha, data[0].senha)
    if(!compare){
        return res.status(400).json({
            sucesso: false,
            message: 'Usuário inválido 2'
        })
    }

    req.session.usuario = ({
        email: email,
        P_nome: data[0].nome.split(' ')[0]
    })

    return res.status(200).json({
        sucesso: true,
        message: 'Usuário autenticado'
    })
})

module.exports = router