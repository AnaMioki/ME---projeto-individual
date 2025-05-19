CREATE DATABASE ScoutEase;

USE ScoutEase;
SHOW TABLES;
select * from usuario;
select * from escoteiro;
select * from mensalidade;


CREATE TABLE usuario
(idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45) NOT NULL,
NomegrupoEscoteiro VARCHAR(45) NOT NULL,
email VARCHAR(45) NOT NULL UNIQUE,
senha VARCHAR(255) NOT NULL
);

CREATE TABLE escoteiro
(registroEscoteiro CHAR(9) PRIMARY KEY,
nome VARCHAR(45) NOT NULL,
dataNasc DATE NOT NULL,
secaoRamo VARCHAR(30),
nomeResponsavel VARCHAR(45),
celular VARCHAR(16),
vencimentoMensalidade DATE,
fkUsuario INT,
CONSTRAINT fkEscoteiroUsuario FOREIGN KEY (fkUsuario)
REFERENCES usuario(idUsuario)
ON DELETE CASCADE
);

CREATE TABLE mensalidade
(idMensalidade INT PRIMARY KEY AUTO_INCREMENT,
valor DECIMAL(10,2),
dataPagamento DATE,
statusMensalidade VARCHAR(9) DEFAULT 'em atraso',
CONSTRAINT chkStatus CHECK( statusMensalidade IN ('em dia', 'em atraso')),
fkEscoteiro CHAR(9) NOT NULL,
CONSTRAINT fkMensalidadeEscoteiro FOREIGN KEY (fkEscoteiro)
REFERENCES escoteiro(registroEscoteiro)
ON DELETE CASCADE
);

ALTER TABLE mensalidade
MODIFY valor DECIMAL(10,2) DEFAULT 25.0;

UPDATE mensalidade
SET valor = 25.0;


ALTER TABLE mensalidade DROP CHECK chkStatus;

ALTER TABLE mensalidade
ADD CONSTRAINT chkStatus
CHECK (statusMensalidade IN ('em dia', 'em atraso'));

SELECT * FROM mensalidade;

DROP TABLE mensalidade;

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
        
        SELECT * FROM mensalidade WHERE fkEscoteiro = 22378645;

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
        
SELECT COUNT(*) AS quantidade
        FROM escoteiro;

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
        ) AND fkUsuario = 2
        ORDER BY 
        CASE WHEN m.statusMensalidade = 'em atraso' THEN 0 ELSE 1 END,
        e.nome;

