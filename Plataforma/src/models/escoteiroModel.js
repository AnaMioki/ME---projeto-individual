var database = require("../database/config");

async function cadastrar(registroEscoteiro, nome, dataNascimento, secaoEscoteira, nome_responsavel, celular, vencimentoMensalidade, fkUsuario) {
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");
    var instrucaoSqlEscoteiro = `
        INSERT INTO escoteiro VALUES
        ('${registroEscoteiro}', '${nome}', '${dataNascimento}', '${secaoEscoteira}', '${nome_responsavel || null}', '${celular}', '${vencimentoMensalidade}', '${fkUsuario}' );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlEscoteiro);
    await database.executar(instrucaoSqlEscoteiro);

    var instrucaoSqlMensalidade = `
        INSERT INTO mensalidade (statusMensalidade, fkEscoteiro)
        VALUES ('em atraso', '${registroEscoteiro}');
    `;
    console.log("Executando a instrução SQL para mensalidade: \n" + instrucaoSqlMensalidade);
    return await database.executar(instrucaoSqlMensalidade);
}

function renderizarEscoteiro(fkUsuario) {
    console.log("ACESSEI O AVISO  MODEL e renderizarEscoteiro \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");

    console.log("fkUsuario recebido:", fkUsuario)
    if (!fkUsuario) {
        console.error('fkusuario não foi fornecido!');
        return;
    }

// eu pego o id de mensalidade mais recente para que eu saiba o status e data de vencimento
// talvez eu mude para que traga a informação em atraso  
// o status deve pegar o mais antigo que esteja em atraso ou pendente ou senao o mais recente
    var instrucaoSql = `
      SELECT
        e.registroEscoteiro,
        e.nome,
        e.secaoRamo,
        DATE_FORMAT(e.vencimentoMensalidade, '%Y-%m-%d') AS vencimentoMensalidade,
        m.statusMensalidade
        FROM escoteiro e
        LEFT JOIN mensalidade m ON e.registroEscoteiro = m.fkEscoteiro
        WHERE m.idMensalidade = (
            SELECT MAX(idMensalidade) FROM mensalidade WHERE fkEscoteiro = e.registroEscoteiro
        ) AND fkUsuario = ${fkUsuario}
        ORDER BY 
        CASE WHEN m.statusMensalidade = 'em atraso' THEN 0 ELSE 1 END,
        e.nome;
    `;
    // ('${registroEscoteiro}', '${nome}', '${secaoEscoteira}', '${vencimentoMensalidade}', '${fkUsuario}' );
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}
// preciso alterar para que eu dê baixa na mensalidade mais antiga (pagina de mensalidade)
function darBaixa(registroEscoteiro) {
    console.log("começando o comando")
    console.log(registroEscoteiro)
     const instrucaoSql = `
           UPDATE mensalidade m
            JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
            SET m.statusMensalidade = 'em dia',
                m.dataPagamento = CURRENT_DATE()
            WHERE m.fkEscoteiro = '${registroEscoteiro}'
            AND MONTH(e.vencimentoMensalidade) = MONTH(CURRENT_DATE())
            AND YEAR(e.vencimentoMensalidade) = YEAR(CURRENT_DATE());
        `;
    console.log("Executando SQL:", instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarEscoteiro(registroEscoteiro) {
    const instrucaoSql = `
        DELETE FROM escoteiro 
        WHERE registroEscoteiro = '${registroEscoteiro}';
    `;
    return database.executar(instrucaoSql);
}

async function buscarEscoteiro(termo) {
    const instrucaoSql = `
        SELECT registroEscoteiro, nome
        FROM escoteiro
        WHERE registroEscoteiro LIKE '%${termo}%' OR nome LIKE '%${termo}%'
        ORDER BY nome;
    `;
    return await database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    renderizarEscoteiro,
    darBaixa,
    deletarEscoteiro,
    buscarEscoteiro
}
