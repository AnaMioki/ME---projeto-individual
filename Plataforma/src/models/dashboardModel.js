var database = require("../database/config");

function obterQuantidadeEscoteiros(fkUsuario) {
    console.log("ACESSEI O ESCOTEIRO MODEL - função obterQuantidadeEscoteiros()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade 
        FROM escoteiro 
        WHERE fkUsuario = ${fkUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterValorArrecadado(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterValorArrecadado()");
    var instrucaoSql = `
        SELECT 
            IFNULL(SUM(m.valor), 0) AS valorArrecadado 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em dia'
        AND YEAR(m.mesReferencia) = YEAR(CURDATE())
        AND MONTH(m.mesReferencia) = MONTH(CURDATE())
        AND e.fkUsuario = ${fkUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};

function obterValorAtrasado(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterValorAtrasado()");
    var instrucaoSql = `
        SELECT IFNULL(SUM(m.valor), 0) AS valorAtrasado 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em atraso' OR m.statusMensalidade = 'pendente'
        AND e.fkUsuario = ${fkUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};

// function obterDadosGraficoLinha(fkUsuario) {
//     console.log("ACESSEI O MENSALIDADE MODEL - função obterDadosGraficoLinha()");
//    return Promise.all([
//         obterValorPrevisto(fkUsuario),
//         obterValorPago(fkUsuario),
//         obterValorInadimplente(fkUsuario)
//     ]);
// };

function obterValorPrevisto(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterValorPrevisto()");
    var instrucaoSql = `
         SELECT 
            DATE_FORMAT(m.mesReferencia, '%Y-%m') AS mesAno,
            COUNT(DISTINCT m.fkEscoteiro) AS qtdEscoteiros,
            MAX(m.valor) AS valorMensalidade,
            SUM(m.valor) AS totalMensal
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE e.fkUsuario = ${fkUsuario}
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterValorPago(fkUsuario) {
    var instrucaoSql = `
       SELECT 
            DATE_FORMAT(m.mesReferencia, '%Y-%m') AS mesAno,
            SUM(m.valor) AS valorPago
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.dataPagamento IS NOT NULL
        AND e.fkUsuario = ${fkUsuario}
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterValorInadimplente(fkUsuario) {
    var instrucaoSql = `
       SELECT 
            DATE_FORMAT(m.mesReferencia, '%Y-%m') AS mesAno,
             IFNULL(SUM(m.valor), 0) AS valorNaoPago
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em atraso' 
        AND e.fkUsuario = ${fkUsuario}
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterDadosGraficoRosca(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterDadosGraficoRosca()");

    return Promise.all([
        obterQuantidadeMensalidadesEmDia(fkUsuario),
        obterQuantidadeMensalidadesPendente(fkUsuario),
        obterQuantidadeMensalidadesEmAtraso(fkUsuario)
    ]);
};

function obterQuantidadeMensalidadesEmDia(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterQuantidadeMensalidadesEmDia()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em dia'
        AND YEAR(m.mesReferencia) = YEAR(CURDATE())
        AND MONTH(m.mesReferencia) = MONTH(CURDATE())
        AND e.fkUsuario = ${fkUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterQuantidadeMensalidadesPendente(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterQuantidadeMensalidadesPendente()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'pendente'
        AND YEAR(m.mesReferencia) = YEAR(CURDATE())
        AND MONTH(m.mesReferencia) = MONTH(CURDATE())
        AND e.fkUsuario = ${fkUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterQuantidadeMensalidadesEmAtraso(fkUsuario) {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterQuantidadeMensalidadesEmAtraso()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em atraso'
        AND YEAR(m.mesReferencia) = YEAR(CURDATE())
        AND MONTH(m.mesReferencia) = MONTH(CURDATE())
        AND e.fkUsuario = ${fkUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    obterQuantidadeEscoteiros,
    obterValorArrecadado,
    obterValorAtrasado,
    // obterDadosGraficoLinha,
    obterDadosGraficoRosca,
    obterValorPrevisto,
    obterValorPago,
    obterValorInadimplente,
    obterQuantidadeMensalidadesEmDia,
    obterQuantidadeMensalidadesPendente,
    obterQuantidadeMensalidadesEmAtraso
}
