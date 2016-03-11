var express = require('express')
var app = express.Router()

var cantantes = require('../models/cantantes')

app.get('/cantantes', function (req, res) {
	res.render('cantantes', {
		singers: cantantes
	})
})

module.exports = app
