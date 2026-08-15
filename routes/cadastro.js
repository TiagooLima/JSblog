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
    try {
        const {nome, email, senha} = req.body
        
        if (!nome || !nome.trim()) {
            return res.status(400).json({
                sucesso: false,
                message: 'Nome é obrigatório'
            })
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                sucesso: false,
                message: 'E-mail inválido'
            })
        }

        if (!senha || senha.length < 6) {
            return res.status(400).json({
                sucesso: false,
                message: 'Senha fraca, faça uma mais forte'
            })
        }

        const emailNormalizado = email.trim().toLowerCase()

        const { data: usuarioExistente, error: erroConsulta } = await supabase.from('usuarios').select('id').eq('email', emailNormalizado).maybeSingle()
        //Se tiver erro
        if (erroConsulta) {
            console.error('Erro ao consultar usuário:', erroConsulta)
            return res.status(500).json({
                sucesso: false,
                message: 'Erro interno, tente novamente'
            })
        }
        // Se email existir no banco de dados
        if (usuarioExistente) {
            return res.status(400).json({
                sucesso: false,
                message: 'E-mail já vinculado à uma conta'
            })
        }

        const hash = await bcrypt.hash(senha, 10)
        const {error} = await supabase.from('usuarios').insert({nome: nome.trim(), email: emailNormalizado, senha: hash})
        if(error){
            return console.log(error)
        }
        
        return res.status(200).json({
            sucesso: true,
            message: 'Conta cadastrada'
        })
    } catch(erro) {
        console.error('Erro inesperado no cadastro:', erro)
        return res.status(500).json({
            sucesso: false,
            message: 'Erro interno, tente novamente'
        })
    }


})

module.exports = router