-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
histórico do meu banco de dados
*/

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

ALTER TABLE mensalidade
ADD COLUMN mesReferencia VARCHAR(10);

ALTER TABLE mensalidade
DROP INDEX unico_mes_por_escoteiro;  -- caso exista essa restrição antiga

ALTER TABLE mensalidade
ADD UNIQUE KEY unico_mes_por_escoteiro (fkEscoteiro, mesReferencia);



UPDATE mensalidade
SET mesReferencia = CONCAT(mesReferencia, '-01')
WHERE LENGTH(mesReferencia) = 7;

ALTER TABLE mensalidade
MODIFY COLUMN mesReferencia DATE;

ALTER TABLE mensalidade DROP CHECK chkStatus;

ALTER TABLE mensalidade 
ADD CONSTRAINT chkStatus 
CHECK (statusMensalidade IN ('em dia', 'em atraso', 'pendente'));

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
WHERE e.fkUsuario = 1
ORDER BY 
    CASE WHEN m.statusMensalidade = 'em atraso' THEN 0 ELSE 1 END,
    e.nome;

SELECT 
            DATE_FORMAT(m.mesReferencia, '%Y-%m') AS mesAno,
            COUNT(DISTINCT m.fkEscoteiro) AS qtdEscoteiros,
            MAX(m.valor) AS valorMensalidade,
            SUM(m.valor) AS totalMensal
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE e.fkUsuario = 1
        GROUP BY mesAno
        ORDER BY mesAno DESC
        LIMIT 6;
        
SELECT idMensalidade, mesReferencia FROM mensalidade ORDER BY idMensalidade DESC;

UPDATE mensalidade
SET mesReferencia = DATE_FORMAT(CURDATE(), '%Y-%m-01');

-- adicao de meses passados
INSERT INTO mensalidade (statusMensalidade, fkEscoteiro, mesReferencia, valor)
VALUES
('em atraso', '78965436', '2025-03-01', 25.00),
('em atraso', '89343212', '2025-03-01', 25.00),
('pendente', '24583412', '2025-03-01', 25.00),

('em atraso', '78965436', '2025-04-01', 25.00),
('em atraso', '89343212', '2025-04-01', 25.00),
('pendente', '24583412', '2025-04-01', 25.00);

INSERT INTO mensalidade (statusMensalidade, fkEscoteiro, mesReferencia, valor)
VALUES
('em dia', '78965436', '2024-12-01', 25.00),
('em dia', '89343212', '2024-12-01', 25.00),
('em dia', '24583412', '2024-12-01', 25.00);

select * from escoteiro;
select * from mensalidade; 

DELETE FROM mensalidade 
WHERE fkEscoteiro NOT IN (SELECT registroEscoteiro FROM escoteiro);
-- SET sql_safe_updates = 0;

 SELECT 
            IFNULL(SUM(m.valor), 0) AS valorArrecadado 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em dia'
        AND YEAR(m.dataPagamento) = YEAR(CURDATE())
        AND MONTH(m.dataPagamento) = MONTH(CURDATE())
        AND e.fkUsuario = 1;
        

 SELECT COUNT(*) AS quantidade 
        FROM mensalidade m
        JOIN escoteiro e ON m.fkEscoteiro = e.registroEscoteiro
        WHERE m.statusMensalidade = 'em dia'
        AND YEAR(m.mesReferencia) = YEAR(CURDATE())
        AND MONTH(m.mesReferencia) = MONTH(CURDATE())
        AND e.fkUsuario = 1;

select * from mensalidade where fkEscoteiro = "12365485";
select * from mensalidade where fkEscoteiro = "23232323";
select * from escoteiro where registroEscoteiro = "23232323";
select * from escoteiro where registroEscoteiro = "12643527";
select * from mensalidade where fkEscoteiro = "12643527";



select * from mensalidade where fkEscoteiro = "26547890";
delete from escoteiro where registroEscoteiro = "26547890";

INSERT INTO escoteiro (
    registroEscoteiro, nome, dataNasc, secaoRamo, nomeResponsavel,
    celular, vencimentoMensalidade, fkUsuario
) VALUES (
    '26547890', 'Escoteiro Teste', '2010-05-15', 'sênior', 'Responsável Teste',
    '11912345678', '2024-12-10', 1
);

INSERT INTO mensalidade (valor, dataPagamento, statusMensalidade, fkEscoteiro, mesReferencia)
VALUES 
(25.00, NULL, 'em atraso', '26547890', '2024-12-01'),
(25.00, NULL, 'em atraso', '26547890', '2025-01-01'),
(25.00, NULL, 'em atraso', '26547890', '2025-02-01'),
(25.00, NULL, 'em atraso', '26547890', '2025-03-01'),
(25.00, NULL, 'em atraso', '26547890', '2025-04-01'),
(50.00, NULL, 'em atraso', '26547890', '2025-05-01');

