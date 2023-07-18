// importação dos módulos
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()// cria o server express

const conn = require('./db/conn') // importa a conexão com o database

// models
const Tought = require('./models/Tought')
const User = require('./models/User')

// imports das routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')
//const userRoutes = require('./routes/userRoutes')

// import toughtcontroller para mostrar na home geral
const ToughtController = require('./controllers/ToughtController')

// template engine
app.engine('handlebars', exphbs.engine()) // adiciona engine handlebars
app.set('view engine', 'handlebars') // seta view engine como handlebars 
app.use(express.static('public'))  // define arquivos estaticos, importa o css


// pra conseguir pegar o body em json
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json())

// session middleware, diz onde o express vai salvar as sessoes
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave : false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function() {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}),
)

// flash messages
app.use(flash())

// set session to res
app.use((req,res,next) =>{
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})


//routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)





// conexao mysql
//{force : true}
conn.sync().then(
    app.listen(3000)
).catch((error) => {console.log(error)})