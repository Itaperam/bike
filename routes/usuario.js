const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')
var user1 = {}

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/login/invalido', (req, res) => {
    res.render('loginInvalido')
})

/*
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        //failureRedirect: '/usuario/login/invalido',
        failureRedirect: '/usuario/login/invalido',
        failureFlash: true
    })(req, res, next)
})*/

router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/usuario/login/invalido",
      failureFlash: true,
    }),(req, res) => {
        user1 = {
            _id: req.user._id,
            nome: req.user.nome,
            sobrenome: req.user.sobrenome,
            email: req.user.email,
            senha: req.user.senha,
            cpf: req.user.cpf,
            rg: req.user.rg
      }
      res.render("index", {logado: user1});
    }
  );

router.get('/cadastro', (req, res) => {
    //renderiza cadastro.handlebars
    res.render('cadastro')
})

router.post('/cadastrado', (req, res) => {

    var erros = [];
    //recupera e analisa dados do formulário
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

//gestão dados acesso
router.get("/conta", (req, res) => {
    res.render("conta", {logado: user1})
})

//gestão dados de acesso- alterar e-mail
router.get("/alterar_email", (req, res) =>{
    res.render("alterar_email", {logado: user1})
})

router.post("/email_alterado", (req, res) =>{
    var erro_email = []

    if(!req.body.novo_email || typeof req.body.novo_email == undefined || req.body.novo_email == null){
        erro_email.push({texto: "E-mail inválido ou vazio"})
    }else{

        Usuario.findOne({email: req.body.novo_email}).then((usuario) => {
            if(usuario){
                erro_email.push({texto: 'E-mail já cadastrado'})
                res.render('alterar_email', {erros: erro_email})
            }else{
                Usuario.findOneAndUpdate({email: user1.email}, {email: req.body.novo_email}, (error, data) =>{
                    if(error){
                        erro_email.push({texto: 'Erro ao atualizar e-mail'})
                        res.render('alterar_email', {erros: erro_email})
                    }else{
                        erro_email.push({texto: 'E-mail atualizado com sucesso!'})
                        res.render('login', {sucesso: erro_email})
                    }
                })
            }
        })
    }

    if(erro_email.length > 0){
        res.render("alterar_email", {erros: erro_email})
    }
    
})

//gestão dados de acesso- alterar senha
router.get("/alterar_senha", (req, res) =>{
    res.render("alterar_senha", {logado: user1})
})

router.post("/senha_alterada", (req, res) => {
    var erro_senha = []


    if(!req.body.senha_atual || typeof req.body.senha_atual == undefined || req.body.senha_atual == null){
        erro_senha.push({texto: "Digite a sua senha atual"})
    }

    if(!req.body.nova_senha || typeof req.body.nova_senha == undefined || req.body.nova_senha == null){
        erro_senha.push({texto: "Digite sua nova senha"})
    }

    if(erro_senha.length > 0){
        res.render("alterar_senha", {erro: erro_senha})
    }

})

//gestão dados pessoais (precisa de algumas validações)
router.get("/dados_pessoais", (req, res) => {
    res.render("dados_pessoais", {logado: user1})
})

router.post("/dados_pessoais_atualizados", (req, res) => {
    var erro_dados = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erro_dados.push({texto: "Digite seu nome"})
    }

    if(!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null){
        erro_dados.push({texto: "Digite seu sobrenome"})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erro_dados.push({texto: "Digite seu CPF"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erro_dados.push({texto: "Digite seu e-mail"})
    }

    /*
    if(!req.body.rg || typeof req.body.rg == undefined || req.body.rg == null){
        erro_dados.push({texto: "Digite seu rg"})
    }*/

    if(erro_dados.length > 0){
        res.render("dados_pessoais", {erros: erro_dados})
    }else{
        var user_id = user1._id

        if(req.body.nome != user1.nome){
            //atualiza nome do usuário
            Usuario.findByIdAndUpdate(user_id, {nome: req.body.nome}, (err, docs) => {
                if(err){
                    erro_dados.push({texto: "Erro ao atualizar nome"})
                    res.render("dados_pessoais", {erros: erro_dados})
                }else{
                    erro_dados.push({texto: "Nome atualizado com sucesso!"})
                    res.render("dados_pessoais", {sucesso: erro_dados})
                }
            })
        }
        
        else if(req.body.sobrenome != user1.sobrenome){
            //atualiza sobrenome do usuário
            Usuario.findByIdAndUpdate(user_id, {sobrenome: req.body.sobrenome}, (err, docs) => {
                if(err){
                    erro_dados.push({texto: "Erro ao atualizar sobrenome"})
                    res.render("dados_pessoais", {erros: erro_dados})
                }else{
                    erro_dados.push({texto: "Sobrenome atualizado com sucesso!"})
                    res.render("dados_pessoais", {sucesso: erro_dados})
                }
            })
        }
        
        else if(req.body.cpf != user1.cpf){
            //atualiza CPF do usuário
            Usuario.findOne({cpf: req.body.cpf}).then((usuario) => {
                if(usuario){
                    erro_dados.push({texto: 'CPF já cadastrado'})
                    res.render('dados_pessoais', {erros: erro_dados})
                }else{
                    Usuario.findByIdAndUpdate(user_id, {cpf: req.body.cpf}, (err, docs) => {
                        if(err){
                            erro_dados.push({texto: "Erro ao atualizar CPF"})
                            res.render("dados_pessoais", {erros: erro_dados})
                        }else{
                            erro_dados.push({texto: "CPF atualizado com sucesso!"})
                            res.render("dados_pessoais", {sucesso: erro_dados})
                        }
                    }) 
                }
            })
        }
        
        /*
        Usuario.findByIdAndUpdate(user_id, {cpf: req.body.cpf}, (err, docs) => {
            if(err){
                erro_dados.push({texto: "Erro ao atualizar nome"})
                res.render("dados_pessoais", {erros: erro_dados})
            }else{
                erro_dados.push({texto: "CPF atualizado com sucesso!"})
                res.render("dados_pessoais", {sucesso: erro_dados})
            }
        })*/
        
        else if(req.body.email != user1.email){
            //atualiza email do usuário
            Usuario.findOne({email: req.body.email}).then((usuario) => {
                if(usuario){
                    erro_dados.push({texto: 'E-mail já cadastrado'})
                    res.render('dados_pessoais', {erros: erro_dados})
                }else{
                    Usuario.findOneAndUpdate({email: user1.email}, {email: req.body.email}, (error, data) =>{
                        if(error){
                            erro_dados.push({texto: 'Erro ao atualizar e-mail'})
                            res.render('dados_pessoais', {erros: erro_dados})
                        }else{
                            erro_dados.push({texto: 'E-mail atualizado com sucesso!'})
                            res.render('dados_pessoais', {sucesso: erro_dados})
                        }
                    })
                }
            })
        }else{
            res.render("dados_pessoais", {logado: user1})
        }
        
        
    }
})
module.exports = router