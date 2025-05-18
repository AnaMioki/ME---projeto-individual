var database = require("../database/config");

function obterQuantidadeEscoteiros() {
    console.log("ACESSEI O ESCOTEIRO MODEL - função obterQuantidadeEscoteiros()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade 
        FROM escoteiro;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterValorArrecadado() {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterValorArrecadado()");
    var instrucaoSql = `
        SELECT IFNULL(SUM(valor), 0) AS valorArrecadado 
        FROM mensalidade 
        WHERE statusMensalidade = 'em dia'
        AND YEAR(dataPagamento) = YEAR(CURDATE())
        AND MONTH(dataPagamento) = MONTH(CURDATE());;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};

function obterValorAtrasado() {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterValorAtrasado()");
    var instrucaoSql = `
        SELECT IFNULL(SUM(valor), 0) AS valorAtrasado 
        FROM mensalidade 
        WHERE statusMensalidade = 'em atraso'
        AND YEAR(dataPagamento) = YEAR(CURDATE())
        AND MONTH(dataPagamento) = MONTH(CURDATE());;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};

function obterDadosGraficoLinha() {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterDadosGraficoLinha()");
    obterValorPrevisto(),
    obterValorPago(),
    obterValorInadimplente()
    
};

function  obterValorPrevisto(){
    console.log("ACESSEI O MENSALIDADE MODEL - função obterValorPrevisto()");
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(dataPagamento, '%Y-%m') AS mesAno,
            COUNT(DISTINCT fkEscoteiro) AS qtdEscoteiros,
            MAX(valor) AS valorMensalidade,
            SUM(valor) AS totalMensal
        FROM mensalidade
        WHERE dataPagamento IS NOT NULL
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function  obterValorPago(){
    var instrucaoSql = `
       SELECT 
        DATE_FORMAT(dataPagamento, '%Y-%m') AS mesAno,
        SUM(valor) AS valorPago
        FROM mensalidade
        WHERE statusMensalidade = 'em dia'
        AND dataPagamento IS NOT NULL
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function  obterValorInadimplente(){
    var instrucaoSql = `
       SELECT 
        DATE_FORMAT(dataPagamento, '%Y-%m') AS mesAno,
        SUM(valor) AS valorNaoPago
        FROM mensalidade
        WHERE statusMensalidade = 'em atraso'
        AND dataPagamento IS NOT NULL
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterDadosGraficoRosca() {
    obterQuantidadeMensalidadesEmAtraso(),
    obterQuantidadeMensalidadesEmDia
    
    console.log("ACESSEI O MENSALIDADE MODEL - função obterDadosGraficoRosca()");
   
};

function obterQuantidadeMensalidadesEmDia() {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterQuantidadeMensalidadesEmDia()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade FROM mensalidade WHERE statusMensalidade = 'em dia';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function obterQuantidadeMensalidadesEmAtraso() {
    console.log("ACESSEI O MENSALIDADE MODEL - função obterQuantidadeMensalidadesEmAtraso()");
    var instrucaoSql = `
        SELECT COUNT(*) AS quantidade FROM mensalidade WHERE statusMensalidade = 'em atraso';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    obterQuantidadeEscoteiros,
    obterValorArrecadado,
    obterValorAtrasado,
    obterDadosGraficoLinha,
    obterDadosGraficoRosca
}
