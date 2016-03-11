var express = require('express')
var app = express.Router()

var user_master = {
	name: 'admin',
	pass: '12345678'
}

app.post('/', function (req, res) {
	if(req.body.nombre == user_master.name && req.body.clave == user_master.pass) {
		res.render('plataforma', {
			user: req.body.nombre
		})
	} else {
		res.render('login', {
			msg: 'Los datos no coinciden'
		})
	}
})

module.exports = app