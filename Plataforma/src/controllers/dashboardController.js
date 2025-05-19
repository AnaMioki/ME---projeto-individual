var dashboardModel = require("../models/dashboardModel");



function obterQuantidadeEscoteiros(req, res) {
    const fkUsuario = req.params.fkUsuario;

    console.log("fkUsuario recebido:", fkUsuario)

    if (!fkUsuario) {
        return res.status(400).send("Parâmetro fkUsuario ausente!");
    }
    dashboardModel.obterQuantidadeEscoteiros(fkUsuario)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            console.error("Erro em obterQuantidadeEscoteiros:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function obterValorArrecadado(req, res) {
    const fkUsuario = req.params.fkUsuario;
    dashboardModel.obterValorArrecadado(fkUsuario)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            console.error("Erro em obterValorArrecadado:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}


function obterValorAtrasado(req, res) {
    const fkUsuario = req.params.fkUsuario;
    dashboardModel.obterValorAtrasado(fkUsuario)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => {
            console.error("Erro em obterValorAtrasado:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

async function obterDadosGraficoLinha(req, res) {
    const fkUsuario = req.params.fkUsuario;

    // try {
    //     const previsto = await dashboardModel.obterValorPrevisto(fkUsuario);
    //     const pago = await dashboardModel.obterValorPago(fkUsuario);
    //     const faltando = await dashboardModel.obterValorInadimplente(fkUsuario);
    dashboardModel.obterDadosGraficoLinha(fkUsuario)
        .then(([previsto, pago, faltando]) => {
            res.status(200).json({ previsto, pago, faltando });
        })
        // res.status(200).json({
        //     previsto,
        //     pago,
        //     faltando
        // });
        .catch(erro => {
        console.error("Erro ao obter dados do gráfico de linha:", erro);
        res.status(500).json({ erro: "Erro ao buscar dados do gráfico de linha." });
    });
}




function obterDadosGraficoRosca(req, res) {
    const fkUsuario = req.params.fkUsuario;
    
    dashboardModel.obterDadosGraficoRosca(fkUsuario)
        .then(([emDia, emAtraso]) => {
            res.status(200).json /*({ emDia, emAtraso });*/
                ({
                    emDia: emDia[0].quantidade,
                    emAtraso: emAtraso[0].quantidade
                });
        })
        .catch((erro) => {
            console.error("Erro em obterDadosGraficoRosca:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}
module.exports = {
    obterQuantidadeEscoteiros,
    obterValorArrecadado,
    obterValorAtrasado,
    obterDadosGraficoLinha,
    obterDadosGraficoRosca
};
