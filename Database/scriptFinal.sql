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


ALTER TABLE mensalidade DROP CHECK chkStatus;

ALTER TABLE mensalidade 
ADD CONSTRAINT chkStatus 
CHECK (statusMensalidade IN ('em dia', 'em atraso', 'pendente'));

-- simulando meses passados
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


INSERT INTO escoteiro (
    registroEscoteiro, nome, dataNasc, secaoRamo, nomeResponsavel,
    celular, vencimentoMensalidade, fkUsuario
) VALUES (
    '26547890', 'Escoteiro Teste', '2010-05-15', 'sênior', 'Responsável Teste',
    '11912345678', '2024-12-10', 1
);

INSERT INTO escoteiro (
    registroEscoteiro, nome, dataNasc, secaoRamo, nomeResponsavel,
    celular, vencimentoMensalidade, fkUsuario
) VALUES (
    '26547891', 'Escoteiro Teste2', '2010-05-15', 'sênior', 'Responsável Teste',
    '11912345679', '2024-12-10', 1
);
INSERT INTO mensalidade (valor, dataPagamento, statusMensalidade, fkEscoteiro, mesReferencia)
VALUES 
(25.00, NULL, 'em atraso', '26547891', '2024-12-01'),
(25.00, NULL, 'em atraso', '26547891', '2025-01-01'),
(25.00, NULL, 'em atraso', '26547891', '2025-02-01'),
(25.00, NULL, 'em atraso', '26547891', '2025-03-01'),
(25.00, NULL, 'em atraso', '26547891', '2025-04-01'),
(50.00, NULL, 'em atraso', '26547891', '2025-05-01');



-- como eu preciso atualizar para a próxima data de vencimento e não para o mês que foi pago, vou adicionar 1
 UPDATE escoteiro e
        JOIN (
            SELECT DATE_ADD(mesReferencia, INTERVAL 1 MONTH) AS proximoMes -- mesReferencia
            FROM mensalidade
            WHERE fkEscoteiro =  '26547891'
              AND statusMensalidade = 'em dia'
            ORDER BY mesReferencia DESC
            LIMIT 1
        ) AS m
        ON e.registroEscoteiro =  '89343212'
        SET e.vencimentoMensalidade = STR_TO_DATE(
            CONCAT(DATE_FORMAT(m.proximoMes, '%Y-%m-'), DATE_FORMAT(e.vencimentoMensalidade, '%d')),
            '%Y-%m-%d'
        );

select * from mensalidade where fkEscoteiro = "12378623";
update mensalidade set valor = 25 where idMensalidade = 95;
select * from escoteiro where registroEscoteiro = "26547890";

select * from mensalidade where mesReferencia = '2025-04-01';

select * from mensalidade where statusMensalidade = "em atraso";

