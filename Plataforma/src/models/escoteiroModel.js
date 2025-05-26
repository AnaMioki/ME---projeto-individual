var database = require("../database/config");

async function cadastrar(registroEscoteiro, nome, dataNascimento, secaoEscoteira, nome_responsavel, celular, vencimentoMensalidade, fkUsuario) {
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");

    const mesReferencia = new Date().toISOString().slice(0, 7) + '-01';
    const diaAtual = new Date().getDate()

    var instrucaoSqlEscoteiro = `
        INSERT INTO escoteiro VALUES
        ('${registroEscoteiro}', '${nome}', '${dataNascimento}', '${secaoEscoteira}', '${nome_responsavel || null}', '${celular}', '${vencimentoMensalidade}', '${fkUsuario}' );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlEscoteiro);
    await database.executar(instrucaoSqlEscoteiro);

    const statusMensalidade = diaAtual > vencimentoMensalidade ? 'em atraso' : 'pendente';

    var instrucaoSqlMensalidade = `
        INSERT INTO mensalidade (statusMensalidade, fkEscoteiro, mesReferencia)
        VALUES ('${statusMensalidade}', '${registroEscoteiro}', '${mesReferencia}');
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


    // faço uma priorização para que mostre o mais antigo se for atraso, ent pendente e então recente pago
    var instrucaoSql = `
      SELECT
            e.registroEscoteiro,
            e.nome,
            e.secaoRamo,
            DATE_FORMAT(e.vencimentoMensalidade, '%Y-%m-%d') AS vencimentoMensalidade,
            m.statusMensalidade
        FROM escoteiro e
        LEFT JOIN mensalidade m ON m.idMensalidade = (
            SELECT idMensalidade FROM mensalidade
            WHERE fkEscoteiro = e.registroEscoteiro
            ORDER BY 
                CASE 
                    WHEN statusMensalidade = 'em atraso' THEN 1
                    WHEN statusMensalidade = 'pendente' THEN 2
                    WHEN statusMensalidade = 'em dia' THEN 3
                    ELSE 4
                END,
                dataPagamento ASC
            LIMIT 1
        )
        WHERE e.fkUsuario = ${fkUsuario}
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
    const instrucaoSqlEscoteiro = `
        DELETE FROM escoteiro 
        WHERE registroEscoteiro = '${registroEscoteiro}';

        DELETE FROM mensalidade WHERE fkEscoteiro = ${registroEscoteiro};
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
