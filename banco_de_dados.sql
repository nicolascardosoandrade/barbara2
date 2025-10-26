-- Creating the SistemaAer database
CREATE DATABASE IF NOT EXISTS SistemaAer;

-- Using the SistemaAer database
USE SistemaAer;

-- Creating the pacientes table with the genero column
CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    genero VARCHAR(50) NOT NULL, -- Nova coluna para gênero
    responsavel VARCHAR(255),
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    convenio VARCHAR(100) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    situacao VARCHAR(50) NOT NULL,
    UNIQUE (cpf)
);

-- Criando a tabela convenios
CREATE TABLE IF NOT EXISTS convenios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_convenio VARCHAR(100) NOT NULL,
    consulta VARCHAR(100) NOT NULL,
    duracao TIME NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    pagamento INT NOT NULL,
    UNIQUE (nome_convenio)
);

-- Criando a tabela agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_consulta DATE NOT NULL,
    nome_paciente VARCHAR(255) NOT NULL,
    telefone VARCHAR(15),
    inicio TIME NOT NULL,
    fim TIME NOT NULL,
    convenio VARCHAR(50) NOT NULL,
    consulta VARCHAR(50) NOT NULL,
    frequencia VARCHAR(50) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índice para otimizar buscas por data_consulta
CREATE INDEX idx_data_consulta ON agendamentos(data_consulta);

-- Índice para otimizar buscas por nome_paciente
CREATE INDEX idx_nome_paciente ON agendamentos(nome_paciente);