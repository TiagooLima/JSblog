const express = require('express')
const router = express.Router()
const validator = require('validator')
const supabase = require('../db')
const cloudinary = require('../cloudinary')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    if(req.session.usuario){
        res.render('minha-conta', {minhaconta:true, classe: 'principal', avatar: req.session.usuario.avatar})
    } else {
        res.redirect('/login')
    }
})

router.post('/', async (req, res) => {
    const {nome, email, senha, senha2} = req.body

    if(!validator.isEmail(email)){
        return res.status(400).json({
            sucesso: false,
            message: 'Insira um e-mail valido'
        })
    }

    if(senha !== senha2){
        return res.status(400).json({
            sucesso: false,
            message: 'As senhas precisam ser iguais'
        })
    }

    if(!nome || nome.trim() == ''){
        return res.status(400).json({
            sucesso: false,
            message: 'O nome precisa ser inserido'
        })
    }

    const { data: usuarioExistente, error: erroConsulta } = await supabase.from('usuarios').select('id').eq('email', email).neq('id', req.session.usuario.usuario_id).maybeSingle(); // excluindo o proprio usuário logado
    if(erroConsulta){
        console.log('Erro ao acessar o banco de dados:', erroConsulta);
        return res.status(500).json({
            sucesso: false,
            message: 'Erro'
        })
    }

    if(usuarioExistente){
        return res.status(400).json({
            sucesso: false,
            message: 'Não foi possível utilizar este e-mail'
        })
    }

    if(!senha || senha.trim() == ''){
        const { data: usuario, error: erro } = await supabase.from('usuarios').update({ email: email, nome: nome }).eq('id', req.session.usuario.usuario_id).select().single();

        if(erro){
            console.log('Erro ao atualizar o banco de dados:', erro);
            return res.status(500).json({
                sucesso: false,
                message: 'Erro'
            })
        }

        req.session.usuario = {
            usuario_id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            P_nome: usuario.nome.split(' ')[0],
        }

    } else {
        if(senha.length < 6){
            return res.status(400).json({
                sucesso: false,
                message: 'Senha muito curta'
            })
        }

        const senhaCripto = await bcrypt.hash(senha, 10)

        const { data: usuario, error: erro } = await supabase.from('usuarios').update({ email: email, nome: nome, senha: senhaCripto }).eq('id', req.session.usuario.usuario_id).select().single();

        if(erro){
            console.log('Erro ao atualizar o banco de dados:', erro);
            return res.status(500).json({
                sucesso: false,
                message: 'Erro'
            })
        }

        req.session.usuario = {
            usuario_id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            P_nome: usuario.nome.split(' ')[0],
            avatar: usuario.avatar || '/imgs/default-user.png'
        }
    }

    return res.status(200).json({
        sucesso: true,
        message: "Usuário autenticado",
    });
})
 
router.post('/foto', async (req, res) => {
    const { img } = req.body

    const usuarioId = req.session.usuario.usuario_id
    const options = {
        folder: 'avatars_jsblog',
        public_id: `user_${usuarioId}`,
        overwrite: true,                
        invalidate: true,
        upload_preset: "avatar_users"             
    };

    try {
        // Upar a imagem
        const result = await cloudinary.uploader.upload(img, options);
        const avatarLink = result.secure_url;


        const {error: erroDB} = await supabase.from('usuarios').update({ avatar: avatarLink }).eq('id', usuarioId);
        if(erroDB){
            console.log('Erro na inserção na foto no banco: ', erroDB);
        }

        req.session.usuario.avatar = avatarLink
        console.log(avatarLink);
        return res.status(200).json({
            sucesso: true,
            message: "Imagem atualizada",
        })
        
    } catch (error) {
        return res.status(400).json({
            sucesso: false,
            message: "Erro, tente novamente mais tarde",
        })
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