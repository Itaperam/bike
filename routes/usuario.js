const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/login', (req, res) => {
    if(req.query.fail)
        res.render('login', {message: "Usuario ou senha invalidos"})
    else
    res.render('login', {message: null})
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/usuario/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/cadastro', (req, res) => {
    res.render('cadastro')
})

router.post('/cadastrado', (req, res) => {

    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido ou vazio"})
    }

    if(!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null){
        erros.push({texto: "Sobrenome inválido ou vazio"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido ou vazio"})
    }

    if(!req.body.data_nascimento || typeof req.body.data_nascimento == undefined || req.body.data_nascimento == null){
        erros.push({texto: "Data de nascimento inválida ou vazia"})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: "CPF inválido ou vazio"})
    }

    if(!req.body.celular || typeof req.body.celular == undefined || req.body.celular == null){
        erros.push({texto: "Celular inválido ou vazio"})
    }

    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erros.push({texto: "Endereco inválido ou vazio"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida ou vazia"})
    }

    if(!req.body.rsenha || typeof req.body.rsenha == undefined || req.body.rsenha == null ){
        erros.push({texto: "Senha repetida inválida ou vazia"})
    }

    if(req.body.senha != req.body.rsenha){
        erros.push({texto: "Não é a msm"})
    }

    if(erros.length > 0){
        res.render('cadastro', {erros: erros})
    } else{

        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                //req.flash("error_msg", "E-mail ja cadastrado")
                erros.push({texto: 'E-mail já cadastrado'})
                res.render('cadastro', {erros: erros})
            } else{
                const novoUsuario = {
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome,
                    email: req.body.email,
                    data_nascimento: req.body.data_nascimento,
                    genero: req.body.genero,
                    cpf: req.body.cpf,
                    celular: req.body.celular,
                    endereco: req.body.endereco,
                    cidade: req.body.cidade,
                    senha: req.body.senha
                  }

                  bcrypt.genSalt(10, (erro, salt) => {
                      bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                            if(erro){
                                erros.push({texto: "Houve um erro durante o salvamento"})
                                res.render('login', {erros: erros})
                            }

                            novoUsuario.senha = hash

                            new Usuario(novoUsuario).save().then(() => {
                                erros.push({texto: "Usuario cadastrado com sucesso!"})
                                res.render('index', {erros: erros})

                            }).catch((erro) => {
                                erros.push({texto: 'Houve um erro ao cadastrar o usuario!'})
                                res.render('index', {erros: erros})
                            })
                      })
                  })
            }
        }).catch((erro) => {
            erros.push({texto: "Houve um erro interno"})
            res.render('login', {erros: erros})
        })
    }
})

module.exports = router