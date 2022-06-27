//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const home = require('./routes/home')
const usuario = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport)


//Configurações
    //Sessão
    app.use(session({
        secret: 'palavra secreta',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: true}
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    
    //Middleware - responsável por intermediar todas as requisições http
    app.use((req, res, next) => {
        //res.locals.success_msg = req.flash('success_msg')
        //res.locals.error_msg = req.flash('error_msg')
        //res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next()
    })

    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: ''}))
    app.set('view engine', 'handlebars')

    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/bicicletapp").then(() => {
        console.log("Conectado ao mongo")
    }).catch((erro) => {
        console.log("Erro ao se conectar: " + erro)
    })

    //Public
    app.use(express.static(path.join(__dirname,"public")))

//Rotas
//Rota Principal
app.get('/', (req, res) => {
    res.render('index')
})
//Rotas Secundarias
app.use('/home', home)
app.use('/usuario', usuario)


//Outros
const PORT = 8081
app.listen(PORT, () => {
console.log("Servidor rodando! ")
})