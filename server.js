require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do banco de dados MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'SistemaAer',
  port: process.env.DB_PORT || 3306
};

// Conexão com o MySQL
async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conectado ao MySQL com sucesso!');
    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
    process.exit(1);
  }
}

let db;
connectDB().then(connection => {
  db = connection;
});

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para listar pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Banco de dados não conectado' });
    const [rows] = await db.execute('SELECT * FROM pacientes ORDER BY nome_completo');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

// Rota para cadastrar paciente
app.post('/api/pacientes', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Banco de dados não conectado' });
    }

    const {
      nomeCompleto,
      responsavel,
      telefone,
      email,
      dataNascimento,
      cpf,
      convenio,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      estado
    } = req.body;

    const cpfLimpo = cpf.replace(/\D/g, '');
    const situacao = 'Ativo';

    const query = `
      INSERT INTO pacientes (
        nome_completo, responsavel, telefone, email, data_nascimento,
        cpf, convenio, cep, logradouro, numero, bairro, cidade, estado, situacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nomeCompleto,
      responsavel || null,
      telefone,
      email,
      dataNascimento,
      cpfLimpo,
      convenio,
      cep.replace(/\D/g, ''),
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      situacao
    ];

    const [result] = await db.execute(query, values);

    res.json({
      success: true,
      message: 'Paciente cadastrado com sucesso!',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'CPF já cadastrado.' });
    }
    console.error('Erro ao cadastrar paciente:', error);
    res.status(500).json({ success: false, error: 'Erro ao cadastrar paciente.' });
  }
});

// Rota para listar convênios
app.get('/api/convenios', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Banco de dados não conectado' });
    const [rows] = await db.execute(`
      SELECT 
        id,
        nome_convenio,
        consulta,
        TIME_FORMAT(duracao, '%H:%i') as duracao,
        valor,
        pagamento
      FROM convenios 
      ORDER BY nome_convenio
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar convênios:', error);
    res.status(500).json({ error: 'Erro ao buscar convênios' });
  }
});

// Rota para cadastrar convênio
app.post('/api/convenios', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Banco de dados não conectado' });
    }

    const { nomeConvenio, consulta, duracao, valor, pagamento } = req.body;

    // Validações
    if (!nomeConvenio || !consulta || !duracao || valor === undefined || pagamento === undefined) {
      return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
    }

    // Valida formato da duração (hh:mm)
    if (!/^\d{2}:\d{2}$/.test(duracao)) {
      return res.status(400).json({ success: false, error: 'Formato de duração inválido. Use hh:mm.' });
    }

    // Valida valor como número positivo
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return res.status(400).json({ success: false, error: 'Valor inválido.' });
    }

    // Valida pagamento como número inteiro não negativo
    const pagamentoNumerico = parseInt(pagamento, 10);
    if (isNaN(pagamentoNumerico) || pagamentoNumerico < 0) {
      return res.status(400).json({ success: false, error: 'Dias para pagamento inválido.' });
    }

    const query = `
      INSERT INTO convenios (nome_convenio, consulta, duracao, valor, pagamento)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      nomeConvenio,
      consulta,
      duracao,
      valorNumerico,
      pagamentoNumerico
    ];

    const [result] = await db.execute(query, values);

    res.json({
      success: true,
      message: 'Convênio cadastrado com sucesso!',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'Convênio já cadastrado.' });
    }
    console.error('Erro ao cadastrar convênio:', error);
    res.status(500).json({ success: false, error: 'Erro ao cadastrar convênio.' });
  }
});

// Rota para editar convênio
app.put('/api/convenios/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Banco de dados não conectado' });
    }

    const { id } = req.params;
    const { nomeConvenio, consulta, duracao, valor, pagamento } = req.body;

    // Validações
    if (!nomeConvenio || !consulta || !duracao || valor === undefined || pagamento === undefined) {
      return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
    }

    // Valida formato da duração (hh:mm)
    if (!/^\d{2}:\d{2}$/.test(duracao)) {
      return res.status(400).json({ success: false, error: 'Formato de duração inválido. Use hh:mm.' });
    }

    // Valida valor como número positivo
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return res.status(400).json({ success: false, error: 'Valor inválido.' });
    }

    // Valida pagamento como número inteiro não negativo
    const pagamentoNumerico = parseInt(pagamento, 10);
    if (isNaN(pagamentoNumerico) || pagamentoNumerico < 0) {
      return res.status(400).json({ success: false, error: 'Dias para pagamento inválido.' });
    }

    const query = `
      UPDATE convenios 
      SET nome_convenio = ?, consulta = ?, duracao = ?, valor = ?, pagamento = ?
      WHERE id = ?
    `;

    const values = [
      nomeConvenio,
      consulta,
      duracao,
      valorNumerico,
      pagamentoNumerico,
      id
    ];

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Convênio não encontrado.' });
    }

    res.json({
      success: true,
      message: 'Convênio atualizado com sucesso!'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'Convênio já cadastrado.' });
    }
    console.error('Erro ao atualizar convênio:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar convênio.' });
  }
});

// Rota para listar agendamentos
app.get('/api/agendamentos', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Banco de dados não conectado' });
    const [rows] = await db.execute(`
      SELECT 
        DATE_FORMAT(data_consulta, '%d/%m/%Y') as data_consulta,
        nome_paciente,
        TIME_FORMAT(inicio, '%H:%i') as inicio,
        TIME_FORMAT(fim, '%H:%i') as fim,
        convenio,
        consulta,
        frequencia,
        observacoes
      FROM agendamentos 
      ORDER BY data_consulta DESC, inicio ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

// Rota para cadastrar agendamento
app.post('/api/agendamentos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Banco de dados não conectado' });
    }

    const {
      dataConsulta,
      nomePaciente,
      telefone,
      inicio,
      fim,
      convenio,
      consulta,
      frequencia,
      observacoes
    } = req.body;

    // Validações básicas
    if (!dataConsulta || !nomePaciente || !inicio || !fim || !convenio || !consulta || !frequencia) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
    }

    const query = `
      INSERT INTO agendamentos (
        data_consulta, nome_paciente, telefone, inicio, fim,
        convenio, consulta, frequencia, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dataConsulta,
      nomePaciente,
      telefone || null,
      inicio,
      fim,
      convenio,
      consulta,
      frequencia,
      observacoes || null
    ];

    const [result] = await db.execute(query, values);

    res.json({
      success: true,
      message: 'Agendamento cadastrado com sucesso!',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao cadastrar agendamento:', error);
    res.status(500).json({ error: 'Erro ao cadastrar agendamento.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (db) {
    await db.end();
    console.log('Conexão com MySQL encerrada.');
  }
  process.exit(0);
});