var express = require('express')
var app = express.Router()

var config = require('../config')

var user_master = {
	name: config.admin.name,
	pass: config.admin.pass
}

app.post('/', function (req, res) {
	if(req.body.nombre == user_master.name && req.body.clave == user_master.pass) {
		res.render('chat', {
			user: req.body.nombre
		})
	} else {
		res.render('login', {
			msg: 'Necesitas Logearte primero'
		})
	}
})

app.get('/', function (req, res) {
	res.render('login', {
		msg: 'Necesitas Logearte primero'
	})
})

module.exports = app