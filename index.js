const express = require('express')
const exphbs = require("express-handlebars")
const hbs = exphbs.create({partialsDir: 'views/partials'})
const supabase = require('./db')
const session = require('express-session')

//configs
const app = express()
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*120 //35 minutos
    }
}))

/*qntd de noticias*/
let contagem = '...'
const atualizarContagem = async () => {
    console.time('qtd')
    const {count, err} = await supabase.from('noticias').select('*', { count: 'exact', head: true })
    console.timeEnd('qtd')

    if(err){
        console.log('Erro:', err)
        return
    }
    contagem = count
    return contagem
}

atualizarContagem()
// atualiza a cada 5 minutos
setInterval(atualizarContagem, 5 * 60 * 1000)


app.use(async(req, res, next) => {
    res.locals.usuario = req.session.usuario 
    res.locals.logado = !!req.session.usuario
    res.locals.qtd = contagem
    next()
})

/*
ROTAS
*/
//login
const rotaLogin = require('./routes/login')
app.use('/login', rotaLogin)

//rota de destruição de sessão
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao tentar fazer logout.');
    }

    res.clearCookie('connect.sid'); 
    res.redirect('/');
  });
});

//rota minha conta
const rotaMinhaConta = require('./routes/minhaconta')
app.use('/minhaconta', rotaMinhaConta)

//cadastro
const rotaCadastro = require('./routes/cadastro')
app.use('/cadastro', rotaCadastro)

//rota principal
app.get('/', async (req, res) => {
    const {data, err} = await supabase.from('noticias_banner').select('*')
    if(err){
        console.log(err);
    }

    const noticia1 = data[0]
    const noticia2 = data[1]
    const noticia3 = data[2]
    const noticia4 = data[3]
    /* console.log(noticia1, noticia2, noticia3, noticia4); */

    res.render('home',  {noticia1, noticia2, noticia3, noticia4} )
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})
