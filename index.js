var express = require('express')
var mongoose = require('mongoose')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var multer = require('multer')
var cloudinary = require('cloudinary')

var path = require('path')
var logger = require('morgan')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')

var config = require('./config')

// Connect MongoDB
mongoose.connect( config.mongodb.mlab , function (err) {
	if(err) {
		return console.log('Error al conectar base de datos: ' + err)
	}
	console.log('Exito!!, Base de datos conectada')
})

cloudinary.config({
	cloud_name: config.cloudinary.cloud_name,
	api_key: config.cloudinary.api_key,
	api_secret: config.cloudinary.api_secret
})

// routes modules require
var index = require('./routes/index')
var login = require('./routes/login')
var signup = require('./routes/signup')
var plataforma = require('./routes/plataforma')
var api = require('./routes/api/index')
var chat = require('./routes/chat')
var cantantes = require('./routes/cantantes')
var personajes = require('./routes/personajes/index')


app.set('port', process.env.PORT || 5000)
app.set('view engine','jade')
app.set('views', path.join(__dirname, './views'))

//CORS middleware
// var allowCrossDomain = function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*')
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

// 	next()
// }

app.use(express.static(path.join(__dirname, './public')))
app.use(logger('dev'))
app.use(multer({dest: './uploads'}))
app.use(methodOverride('_method'))
// app.use(allowCrossDomain)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(favicon(path.join(__dirname, './public/images/favicon.ico')))

// use routes modules
app.use('/', index)
app.use('/login', login)
app.use('/signup', signup)
app.use('/plataforma', plataforma)
app.use('/api', api)
app.use('/chat', chat)
app.use('/', cantantes)
app.use('/personajes', personajes)


// socket.io connection

io.on('connection', function (socket) {
	socket.on('chat message', function (content) {
		io.emit('chat message', content)
	})
})

io.on('connection', function (socket) {
	console.log('User connected')
	socket.on('disconnected', function () {
		console.log('User disconnected')
	})
})

app.use(function (req, res) {
	res.statusCode = 404
	res.send('Error 404 - Not Found')
})

app.use(function (req, res) {
	res.statusCode = 500
	res.send('Error 500 - Fail Server. Please Try later')
})

http.listen(app.set('port'), function (err) {
	if(err) {
		return console.log('Error al abrir servidor: ' + err)
	}
	console.log('Server iniciado en el puerto: ' + app.set('port'))
})
