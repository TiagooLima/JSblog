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
        maxAge: 1000*60*10 
    }
}))
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario
    res.locals.logado = !!req.session.usuario
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

//cadastro
const rotaCadastro = require('./routes/cadastro')
app.use('/cadastro', rotaCadastro)

//rota principal
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})
