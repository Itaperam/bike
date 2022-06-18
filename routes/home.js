const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
//require('../models/Usuario')
//const Usuario = mongoose.model('usuarios')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/vender', (req, res) =>{
    res.send("<h1>Vendas</h1>")
})

router.get('/alugar', (req, res) =>{
    res.send("<h1>Alugar</h1>")
})

router.get('/eventos', (req, res) =>{
    res.send("<h1>Eventos</h1>")
})

router.get('/roteiros', (req, res) => {
    res.send("<h1>Roteiros</h1>")
})

module.exports = router