const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    data_nascimento: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: false
    },
    cpf: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    
    logado: {
        type: Number,
        default: 0
    }
})

mongoose.model("usuarios", Usuario)