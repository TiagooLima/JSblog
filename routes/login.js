const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const supabase = require("../db");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
    try{
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
            sucesso: false,
            message: "Preencha e-mail e senha",
            });
        }
        const emailNormalizado = email.trim().toLowerCase();

        const { data: usuario, error: erroConsulta } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", emailNormalizado)
        .maybeSingle();

        if (erroConsulta) {
            console.error('Erro ao consultar usuário:', erroConsulta)
            return res.status(500).json({
                sucesso: false,
                message: 'Erro interno, tente novamente'
            })
        }

        if (!usuario) {
            return res.status(400).json({
                sucesso: false,
                message: 'Usuário inválido'
            })
        }
        
        //comparação de senha
        const compare = await bcrypt.compare(senha, usuario.senha);

        if (!compare) {
            return res.status(400).json({
                sucesso: false,
                message: "Usuário inválido",
            });
        }

        req.session.usuario = {
            usuario_id: usuario.id,
            email: usuario.email,
            P_nome: usuario.nome.split(' ')[0],
            nome: usuario.nome
        }

        return res.status(200).json({
            sucesso: true,
            message: "Usuário autenticado",
        });
        
    } catch (erro) {
        console.error('Erro inesperado no login:', erro)
        return res.status(500).json({
            sucesso: false,
            message: 'Erro interno, tente novamente'
        })
    }
});

module.exports = router;
