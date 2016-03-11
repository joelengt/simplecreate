var express = require('express')
var app = express.Router()

app.get('/books', function (req, res) {
	var data = [{nombre:'Joel1', age:19},{nombre:'Joel2', age:19},{nombre:'Joel3', age:19}]
	res.send(data)
})

app.get('/doc', function (req, res) {
	res.send('All documentacion')
})

module.exports = app