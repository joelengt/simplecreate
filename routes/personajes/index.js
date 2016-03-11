var express = require('express')
var app = express.Router()
var cloudinary = require('cloudinary')
var Personajes = require('../../models/personajes')

// GET: Read Personajes 
app.get('/', function (req, res) {
	Personajes.find(function (err, personajes) {
		if(err) {
			return res.send('Error No se encontro Personajes: ' + err)
		}
		
		personajes = personajes.reverse()

		res.render('cantantes', {
			singers: personajes 
		})
	})
})

// GET: Read One Personaje
app.get('/detalle/:id', function (req, res) {
	var id = req.params.id
	Personajes.findById(id, function (err, personaje) {
		if(err) {
			return res.send('Error, al encontrar personaje: ' + err)
		}
		res.render('./personajes/detalle', {
			pj: personaje
		})
	})
})

// POST: crete One Personaje

// Optener el formulario de registro
app.get('/register', function (req, res) {
	res.render('./personajes/add')
})

// register one personaje
app.post('/register/add', function (req, res) {
	var personaje = new Personajes({
		name: req.body.name,
		age: req.body.age,
		avatar: './images/not_found.png'
	})

	if(req.files.hasOwnProperty("image_avatar")) {
		cloudinary.uploader.upload(req.files.image_avatar.path, function(result) {
			personaje.avatar = result.url

			personaje.save(function (err) {
				if(err) {
					return res.send('Error al guardar: ' + err)
				}
				res.redirect('/personajes')
			})

		},
		{ width: 800, height: 600, crop: "limit" })
	} else {
		personaje.save(function (err) {
			if(err) {
				return res.send('Error al guardar: ' + err)
			}
			console.log('Sin imagen')
			res.redirect('/personajes')
		})
	}

})

// DELETE: remove one personaje

// render al form de confirmacion

app.post('/delete/:id', function (req, res) {
	var id = req.params.id
	Personajes.findById(id, function (err, element) {
		if(err) {
			return res.send('Error al encontrar personaje: ' + err )
		}
		res.render('./personajes/delete', {
			pj: element
		})
	})
})

// methodo delete, remove confirmado

app.delete('/delete/:id', function (req, res) {
	var id = req.params.id
	var admin = {
		nombre: 'admin',
		pass: '12345678'
	}
	if(req.body.usuario == admin.nombre && req.body.clave == admin.pass) {
		Personajes.remove({"_id":id}, function (err) {
			if(err) {
				return res.send('Error al borrar personaje: ' + err)
			}
			res.redirect('/personajes')
		})
	} else {
		Personajes.findById(id, function (err, element) {
			if(err) {
				return res.send('Error al encontrar elemento: ' + err)
			}
			res.render('./personajes/delete', {
				pj: element,
				msg: 'Autentificacion incorrecta, intente otra vez'
			})
		})
	}
})

// PUT: update one personaje

// formulario de edicion
app.post('/update/:id', function (req, res) {
	var id = req.params.id
	Personajes.findById(id, function (err , element) {
		if(err) {
			 return res.send('Error al encontrar elemento: ' + err)
		}
		res.render('./personajes/update', {
			id: element._id,
			name: element.name,
			age: element.age,
			avatar: element.avatar
		})
	})
})

app.put('/update/:id', function (req, res) {
	var id = req.params.id
	var data = {
		name: req.body.name,
		age: req.body.age
	}

	if(req.files.hasOwnProperty("image_avatar")) {
		cloudinary.uploader.upload(req.files.image_avatar.path, function (result) {
			data.avatar = result.url
			Personajes.update({"_id":id}, data, function (err) {
				if(err) {
					return res.send('Error al actualizar element' + err)
				}
				Personajes.findById(id, function (err, element) {
					if(err) {
						 return res.send('Error encontrar elemento: ' + err)
					}
					res.render('./personajes/detalle', {
						pj: element,
						msg: 'El elemento se Actualizo Exitosamente!'
					})
				})
			})
		},
		{ width: 800, height: 600, crop: "limit" })
	} else {

		Personajes.update({"_id":id}, data, function (err) {
			if(err) {
				return res.send('Error al actualizar element' + err)
			}
			Personajes.findById(id, function (err, element) {
				if(err) {
					 return res.send('Error encontrar elemento: ' + err)
				}
				res.render('./personajes/detalle', {
					pj: element,
					msg: 'El elemento se Actualizo Exitosamente! - Avatar No modificado'
				})
			})
		})

	}

})

module.exports = app