CREATE DATABASE ScoutEase;

USE ScoutEase;
SHOW TABLES;
select * from usuario;


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
valor DECIMAL(10,2) NOT NULL,
dataPagamento DATE,
statusMensalidade VARCHAR(8),
CONSTRAINT chkStatus CHECK( statusMensalidade IN ('pago', 'atrasado')),
fkEscoteiro CHAR(9),
CONSTRAINT fkMensalidadeEscoteiro FOREIGN KEY (fkEscoteiro)
REFERENCES escoteiro(registroEscoteiro)
ON DELETE CASCADE
);


