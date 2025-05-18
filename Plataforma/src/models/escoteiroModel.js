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
        )
        ORDER BY 
        CASE WHEN m.statusMensalidade = 'em atraso' THEN 0 ELSE 1 END,
        e.nome;
    `;
    // ('${registroEscoteiro}', '${nome}', '${secaoEscoteira}', '${vencimentoMensalidade}', '${fkUsuario}' );
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}

function darBaixa(registroEscoteiro) {
    const instrucaoSql = `
        UPDATE escoteiro
        SET statusMensalidade = 'em dia'
        WHERE registroEscoteiro = '${registroEscoteiro}';
    `;
    return database.executar(instrucaoSql);
}


function listar() {
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");
    var instrucaoSql = `
        SELECT 
            a.id AS idAviso,
            a.titulo,
            a.descricao,
            a.fk_usuario,
            u.id AS idUsuario,
            u.nome,
            u.email,
            u.senha
        FROM aviso a
            INNER JOIN usuario u
                ON a.fk_usuario = u.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function pesquisarDescricao(texto) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function pesquisarDescricao()");
    var instrucaoSql = `
        SELECT 
            a.id AS idAviso,
            a.titulo,
            a.descricao,
            a.fk_usuario,
            u.id AS idUsuario,
            u.nome,
            u.email,
            u.senha
        FROM aviso a
            INNER JOIN usuario u
                ON a.fk_usuario = u.id
        WHERE a.descricao LIKE '${texto}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function editar(novaDescricao, idAviso) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar(): ", novaDescricao, idAviso);
    var instrucaoSql = `
        UPDATE aviso SET descricao = '${novaDescricao}' WHERE id = ${idAviso};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idAviso) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar():", idAviso);
    var instrucaoSql = `
        DELETE FROM aviso WHERE id = ${idAviso};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    renderizarEscoteiro,
    darBaixa
}
