var escoteiroModel = require("../models/escoteiroModel");
var database = require("../database/config");

// function cadastrar(req, res) {

//     var nome = req.body.nome;
//     var registroEscoteiro = req.body.registro;
//     var dataNascimento = req.body.nascimento;
//     var secaoEscoteira = req.body.secao;
//     var nome_responsavel = req.body.responsavel;
//     var celular = req.body.celular;
//     var vencimentoMensalidade = req.body.vencimentoMensalidade;
//     var fkUsuario = req.params.fkUsuario;

//     // var idade = calcularIdade(dataNascimento);
//     // var secaoEscoteira = "";

//     // if (idade < 6) {
//     //     return res.status(400).json({ erro: "Idade mínima para escoteiro é 6 anos." });
//     // } else if (idade < 11) {
//     //     secaoEscoteira = "Lobinho";
//     // } else if (idade < 15) {
//     //     secaoEscoteira = "Escoteiro";
//     // } else if (idade < 18) {
//     //     secaoEscoteira = "Sênior";
//     // } else if (idade < 21) {
//     //     secaoEscoteira = "Pioneiro";
//     // } else {
//     //     secaoEscoteira = "Adulto Voluntário";
//     // }

//     if (!nome || !registroEscoteiro || !dataNascimento || !celular || !vencimentoMensalidade || !fkUsuario) {
//         return res.status(400).send("Preencha todos os campos obrigatórios!");
//     }


//     escoteiroModel.cadastrar(registroEscoteiro,
//         nome,
//         dataNascimento,
//         secaoEscoteira,
//         nome_responsavel,
//         celular,
//         vencimentoMensalidade,
//         fkUsuario
//     ).then(function (resultado) {
//         if (resultado.length > 0) {
//             res.status(200).json(resultado);
//         } else {
//             res.status(204).send("Nenhum resultado encontrado!")
//         }
//     }).catch(function (erro) {
//         console.log(erro);
//         console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
//         res.status(500).json(erro.sqlMessage);
//     });
// }

async function cadastrar(req, res) {
    var nome = req.body.nome;
    var registroEscoteiro = req.body.registro;
    var dataNascimento = req.body.nascimento;
    var secaoEscoteira = req.body.secao;
    var nome_responsavel = req.body.responsavel;
    var celular = req.body.celular;
    var vencimentoMensalidade = req.body.vencimentoMensalidade;
    var fkUsuario = req.params.fkUsuario;

    if (!nome || !registroEscoteiro || !dataNascimento || !celular || !vencimentoMensalidade || !fkUsuario) {
        return res.status(400).send("Preencha todos os campos obrigatórios!");
    }

    try {
        const verificarSql = `SELECT * FROM escoteiro WHERE registroEscoteiro = '${registroEscoteiro}';`;
        const resultado = await database.executar(verificarSql);

        if (resultado.length > 0) {
            return res.status(409).json({ erro: "Já existe um escoteiro com esse registro." });
        }

        const resultadoCadastro = await escoteiroModel.cadastrar(
            registroEscoteiro,
            nome,
            dataNascimento,
            secaoEscoteira,
            nome_responsavel,
            celular,
            vencimentoMensalidade,
            fkUsuario
        );

        return res.status(200).json(resultadoCadastro);

    } catch (erro) {
        console.log("Erro ao cadastrar escoteiro:", erro);
        return res.status(500).json({ erro: erro.sqlMessage || erro.message });
    }
}



function renderizarEscoteiro(req, res) {
    const fkUsuario = req.params.fkUsuario;

    console.log("fkUsuario recebido:", fkUsuario)

    if (!fkUsuario) {
        return res.status(400).send("Parâmetro fkUsuario ausente!");
    }

    escoteiroModel.renderizarEscoteiro(fkUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                console.log(resultado)
                res.status(200).send("Nenhum escoteiro encontrado. :(")
            }
        })

        .catch(erro => {
            console.error("Erro ao buscar escoteiros: ", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}
// var nome = res.body.nome;
// var registroEscoteiro = res.body.registro;
// var secaoEscoteira = res.body.secao;
// var statusMensalidade = res.body.statusMensalidade
// var vencimentoMensalidade = res.body.vencimentoMensalidade;


function darBaixa(req, res) {
    console.log("chegou no cotnroleer", req.body.registroEscoteiro)
    const registroEscoteiro = req.body.registroEscoteiro;

    escoteiroModel.darBaixa(registroEscoteiro)
        .then(() => {
            //   console.log("Resultado do model:", resultado);
            res.status(200).send({ mensagem: "Mensalidade atualizada com sucesso" });
        })
        .catch(erro => {
            console.error("Erro ao dar baixa: ", erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });

}


async function deletarEscoteiro(req, res) {
     const registroEscoteiro = req.params.registroEscoteiro;
    if (!registroEscoteiro) {
        return res.status(400).json({ erro: 'Registro do escoteiro não fornecido' });
    }

    try {
        await escoteiroModel.deletarEscoteiro(registroEscoteiro);
        res.json({ mensagem: "Escoteiro deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao deletar escoteiro" });
    }
}

async function buscarEscoteiro(req, res) {
    const termo = req.query.termo;

    if (!termo) {
        return res.status(400).json({ erro: "O termo de busca é obrigatório." });
    }

    try {
        const resultado = await escoteiroModel.buscarEscoteiro(termo);

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum escoteiro encontrado." });
        }

        res.status(200).json(resultado);
    } catch (erro) {
        console.error("Erro ao buscar escoteiro:", erro.sqlMessage || erro);
        res.status(500).json({ erro: "Erro ao buscar escoteiro." });
    }
}



// function calcularIdade(data) {
//     const hoje = new Date();
//     const nascimento = new Date(data);
//     let idade = hoje.getFullYear() - nascimento.getFullYear();
//     const m = hoje.getMonth() - nascimento.getMonth();
//     if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
//         idade--;
//     }
//     return idade;
// }

// function formatarDataIso(dataNascimento) {
//     // se já estiver no formato correto, retorna direto
//     if (dataNascimento.includes("-")) return dataNascimento;

//     const [dia, mes, ano] = dataNascimento.split("/");
//     return `${ano}-${mes}-${dia}`;
// }


module.exports = {
    cadastrar,
    renderizarEscoteiro,
    darBaixa,
    deletarEscoteiro, 
    buscarEscoteiro
}