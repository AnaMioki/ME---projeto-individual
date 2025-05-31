var database = require("../database/config");

async function cadastrar(registroEscoteiro, nome, dataNascimento, secaoEscoteira, nome_responsavel, celular, vencimentoMensalidade, fkUsuario) {
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");

    const mesReferencia = new Date().toISOString().slice(0, 7) + '-01';
    const diaAtual = new Date()
    const vencimento = new Date(vencimentoMensalidade);

    var instrucaoSqlEscoteiro = `
        INSERT INTO escoteiro VALUES
        ('${registroEscoteiro}', '${nome}', '${dataNascimento}', '${secaoEscoteira}', '${nome_responsavel || null}', '${celular}', '${vencimentoMensalidade}', '${fkUsuario}' );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlEscoteiro);
    await database.executar(instrucaoSqlEscoteiro);

    const statusMensalidade = diaAtual > vencimento ? 'em atraso' : 'pendente';
    console.log(diaAtual);

    // console.log("Hoje:", diaAtual.toISOString().slice(0, 10), " | Vencimento:", vencimento.toISOString().slice(0, 10));
    console.log("Status definido:", statusMensalidade);
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
            CASE WHEN m.statusMensalidade = 'em atraso' THEN 0 ELSE 1 END;
            -- e.nome;

            `;
    // ('${registroEscoteiro}', '${nome}', '${secaoEscoteira}', '${vencimentoMensalidade}', '${fkUsuario}' );
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}
// preciso alterar para que eu dê baixa na mensalidade mais antiga (pagina de mensalidade)
async function darBaixa(registroEscoteiro) {
    console.log("começando o comando")
    console.log(registroEscoteiro)
    const instrucaoSql = `
            UPDATE mensalidade m
        JOIN (
            SELECT idMensalidade
            FROM mensalidade
            WHERE fkEscoteiro = '${registroEscoteiro}'
              AND (statusMensalidade = 'pendente' OR statusMensalidade = 'em atraso')
            ORDER BY mesReferencia ASC
            LIMIT 1 
        ) AS maisAntiga ON m.idMensalidade = maisAntiga.idMensalidade
        SET m.statusMensalidade = 'em dia',
            m.dataPagamento = CURRENT_DATE();`;
    console.log("Executando SQL:", instrucaoSql);
    await database.executar(instrucaoSql);

    const instrucaoSqlvencimentoMensalidade = `
    UPDATE escoteiro e
        JOIN (
            SELECT DATE_ADD(mesReferencia, INTERVAL 1 MONTH) AS proximoMes -- mesReferencia
            FROM mensalidade
            WHERE fkEscoteiro =  '${registroEscoteiro}'
              AND statusMensalidade = 'em dia'
            ORDER BY mesReferencia DESC
            LIMIT 1
        ) AS m
        ON e.registroEscoteiro =  ${registroEscoteiro}
        SET e.vencimentoMensalidade = STR_TO_DATE(
            CONCAT(DATE_FORMAT(m.proximoMes, '%Y-%m-'), DATE_FORMAT(e.vencimentoMensalidade, '%d')),
            '%Y-%m-%d'
        );
    `;
    console.log("Executando SQL:", instrucaoSqlvencimentoMensalidade);
    return await database.executar(instrucaoSqlvencimentoMensalidade);
}

async function carregarDadosEscoteiro(registroEscoteiro) {
    console.log("entrei em carregar Dados Escoteiro do escoteiro")
    const instrucaoSql = `
           SELECT * from
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
// adicionar o comando
async function carregarMensalidadesEscoteiro(registroEscoteiro) {
    console.log("entrei em carregarMensalidades do escoteiro")
    const instrucaoSql = `
           SELECT * from
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

async function deletarEscoteiro(registroEscoteiro) {
    console.log("entrei no model")

    const deletarMensalidades = `
        DELETE FROM mensalidade WHERE fkEscoteiro = '${registroEscoteiro}';
    `;
    await database.executar(deletarMensalidades);
    const deletarEscoteiro = `
        DELETE FROM escoteiro WHERE registroEscoteiro = '${registroEscoteiro}';
    `;
    return await database.executar(deletarEscoteiro);

    // return database.executar(deletarMensalidades)
    //     .then(() => database.executar(deletarEscoteiro));
    // return database.executar(instrucaoSql);
}

// async function buscarEscoteiro(termo) {
//     const instrucaoSql = `
//         SELECT registroEscoteiro, nome
//         FROM escoteiro
//         WHERE registroEscoteiro LIKE '%${termo}%' OR nome LIKE '%${termo}%'
//         ORDER BY nome;
//     `;
//     return await database.executar(instrucaoSql);
// }

module.exports = {
    cadastrar,
    renderizarEscoteiro,
    darBaixa,
    deletarEscoteiro,
    // buscarEscoteiro
}
