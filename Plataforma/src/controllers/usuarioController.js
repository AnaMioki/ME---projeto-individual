var usuarioModel = require("../models/usuarioModel");

function entrar(req, res) {
    var email = req.body.emailServer.trim().toLowerCase();;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.entrar(email, senha)
            .then(
                function (resultadoEntrar) {
                    console.log(`\nResultados encontrados: ${resultadoEntrar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoEntrar)}`); // transforma JSON em String


                    if (resultadoEntrar.length == 1) {
                        console.log(resultadoEntrar);
                        res.json(resultadoEntrar[0]);

                        // aquarioModel.buscarAquariosPorEmpresa(resultadoEntrar[0].empresaId)
                        //     .then((resultadoAquarios) => {
                        //         if (resultadoAquarios.length > 0) {
                        //             res.json({
                        //                 id: resultadoEntrar[0].id,
                        //                 email: resultadoEntrar[0].email,
                        //                 nome: resultadoEntrar[0].nome,
                        //                 senha: resultadoEntrar[0].senha,
                        //                 aquarios: resultadoAquarios
                        //             });
                        //         } else {
                        //             res.status(204).json({ aquarios: [] });
                        //         }
                        //     })
                    } else if (resultadoEntrar.length == 0) {
                        res.status(403).send({erro: "Email e/ou senha inválido(s)"});
                    } else {
                        res.status(403).send({erro:"Mais de um usuário com o mesmo login e senha!"});
                    }
                })


            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nome;
    var nomeGrupoEscoteiro = req.body.nomeGrupoEscoteiro;
    var email = req.body.email.trim().toLowerCase();
    var senha = req.body.senha;

    // Faça as validações dos valores
    // if (nome == undefined) {
    //     res.status(400).send("Seu nome está undefined!");
    // } else if (nomeGrupoEscoteiro == undefined){
    //     res.status(400).send("O nome do seu grupo escoteiro está undefined!");
    // }
    // else if (email == undefined) {
    //     res.status(400).send("Seu email está undefined!");
    // } else if (senha == undefined) {
    //     res.status(400).send("Sua senha está undefined!");
    // } else {

    if (!nome || !nomeGrupoEscoteiro || !email || !senha) {
        res.status(400).send("Campos obrigatórios não preenchidos!");
        return;
    }

    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    usuarioModel.cadastrar(nome, nomeGrupoEscoteiro, email, senha)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}


module.exports = {
    entrar,
    cadastrar
}