var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PersonajesSchema = new Schema({
	name: String,
	age: Number,
	avatar: String
})

var Personajes = mongoose.model('Personajes', PersonajesSchema)

module.exports = Personajes
