require("dotenv").config()
const express = require("express")
const mysql = require("mysql2/promise")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Configuração do banco de dados MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "SistemaAer",
  port: process.env.DB_PORT || 3306,
}

// Conexão com o MySQL
async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    console.log("Conectado ao MySQL com sucesso!")
    return connection
  } catch (error) {
    console.error("Erro ao conectar ao MySQL:", error)
    process.exit(1)
  }
}

let db
connectDB().then((connection) => {
  db = connection
})

// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Rota inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// ========================
// PACIENTES
// ========================

// Listar todos os pacientes
app.get("/api/pacientes", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Banco de dados não conectado" })
    const [rows] = await db.execute(`
      SELECT 
        id,
        nome_completo,
        genero,
        responsavel,
        telefone,
        email,
        data_nascimento,
        cpf,
        convenio,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        situacao
      FROM pacientes 
      ORDER BY nome_completo
    `)
    res.json(rows)
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
    res.status(500).json({ error: "Erro ao buscar pacientes" })
  }
})

// Buscar paciente por ID
app.get("/api/pacientes/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Banco de dados não conectado" })
    const [rows] = await db.execute(`
      SELECT 
        id,
        nome_completo,
        genero,
        responsavel,
        telefone,
        email,
        data_nascimento,
        cpf,
        convenio,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        situacao
      FROM pacientes 
      WHERE id = ?
    `, [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: "Paciente não encontrado" })
    }
    res.json(rows[0])
  } catch (error) {
    console.error("Erro ao buscar paciente:", error)
    res.status(500).json({ error: "Erro ao buscar paciente" })
  }
})

// Cadastrar paciente
app.post("/api/pacientes", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const {
      nomeCompleto,
      genero,
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
      estado,
      situacao,
    } = req.body

    const validGeneros = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"]
    if (!validGeneros.includes(genero)) {
      return res.status(400).json({ success: false, error: "Gênero inválido." })
    }

    const cpfLimpo = cpf.replace(/\D/g, "")
    const cepLimpo = cep.replace(/\D/g, "")
    const situacaoPaciente = situacao || "Ativo"

    if (!nomeCompleto || !genero || !telefone || !email || !dataNascimento || !cpfLimpo || !convenio || !cepLimpo || !logradouro || !numero || !bairro || !cidade || !estado) {
      return res.status(400).json({ success: false, error: "Todos os campos obrigatórios devem ser preenchidos." })
    }

    const query = `
      INSERT INTO pacientes (
        nome_completo, genero, responsavel, telefone, email, data_nascimento,
        cpf, convenio, cep, logradouro, numero, bairro, cidade, estado, situacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const values = [
      nomeCompleto,
      genero,
      responsavel || null,
      telefone,
      email,
      dataNascimento,
      cpfLimpo,
      convenio,
      cepLimpo,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      situacaoPaciente,
    ]

    const [result] = await db.execute(query, values)

    res.json({
      success: true,
      message: "Paciente cadastrado com sucesso!",
      id: result.insertId,
    })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, error: "CPF já cadastrado." })
    }
    console.error("Erro ao cadastrar paciente:", error)
    res.status(500).json({ success: false, error: "Erro ao cadastrar paciente." })
  }
})

// Atualizar paciente
app.put("/api/pacientes/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const { id } = req.params
    const {
      nomeCompleto,
      genero,
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
      estado,
      situacao,
    } = req.body

    const validGeneros = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"]
    if (!validGeneros.includes(genero)) {
      return res.status(400).json({ success: false, error: "Gênero inválido." })
    }

    const cpfLimpo = cpf.replace(/\D/g, "")
    const cepLimpo = cep.replace(/\D/g, "")
    const situacaoPaciente = situacao || "Ativo"

    if (!nomeCompleto || !genero || !telefone || !email || !dataNascimento || !cpfLimpo || !convenio || !cepLimpo || !logradouro || !numero || !bairro || !cidade || !estado) {
      return res.status(400).json({ success: false, error: "Todos os campos obrigatórios devem ser preenchidos." })
    }

    const query = `
      UPDATE pacientes 
      SET 
        nome_completo = ?, 
        genero = ?, 
        responsavel = ?, 
        telefone = ?, 
        email = ?, 
        data_nascimento = ?, 
        cpf = ?, 
        convenio = ?, 
        cep = ?, 
        logradouro = ?, 
        numero = ?, 
        bairro = ?, 
        cidade = ?, 
        estado = ?, 
        situacao = ?
      WHERE id = ?
    `

    const values = [
      nomeCompleto,
      genero,
      responsavel || null,
      telefone,
      email,
      dataNascimento,
      cpfLimpo,
      convenio,
      cepLimpo,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      situacaoPaciente,
      id,
    ]

    const [result] = await db.execute(query, values)

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Paciente não encontrado." })
    }

    res.json({
      success: true,
      message: "Paciente atualizado com sucesso!",
    })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, error: "CPF já cadastrado para outro paciente." })
    }
    console.error("Erro ao atualizar paciente:", error)
    res.status(500).json({ success: false, error: "Erro ao atualizar paciente." })
  }
})

// ========================
// CONVÊNIOS
// ========================

// Listar convênios
app.get("/api/convenios", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Banco de dados não conectado" })
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
    `)
    res.json(rows)
  } catch (error) {
    console.error("Erro ao buscar convênios:", error)
    res.status(500).json({ error: "Erro ao buscar convênios" })
  }
})

// Cadastrar convênio
app.post("/api/convenios", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const { nomeConvenio, consulta, duracao, valor, pagamento } = req.body

    if (!nomeConvenio || !consulta || !duracao || valor === undefined || pagamento === undefined) {
      return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios." })
    }

    if (!/^\d{2}:\d{2}$/.test(duracao)) {
      return res.status(400).json({ success: false, error: "Formato de duração inválido. Use hh:mm." })
    }

    const valorNumerico = Number.parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return res.status(400).json({ success: false, error: "Valor inválido." })
    }

    const pagamentoNumerico = Number.parseInt(pagamento, 10)
    if (isNaN(pagamentoNumerico) || pagamentoNumerico < 0) {
      return res.status(400).json({ success: false, error: "Dias para pagamento inválido." })
    }

    const query = `
      INSERT INTO convenios (nome_convenio, consulta, duracao, valor, pagamento)
      VALUES (?, ?, ?, ?, ?)
    `

    const values = [nomeConvenio, consulta, duracao, valorNumerico, pagamentoNumerico]

    const [result] = await db.execute(query, values)

    res.json({
      success: true,
      message: "Convênio cadastrado com sucesso!",
      id: result.insertId,
    })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, error: "Convênio já cadastrado." })
    }
    console.error("Erro ao cadastrar convênio:", error)
    res.status(500).json({ success: false, error: "Erro ao cadastrar convênio." })
  }
})

// Atualizar convênio
app.put("/api/convenios/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const { id } = req.params
    const { nomeConvenio, consulta, duracao, valor, pagamento } = req.body

    if (!nomeConvenio || !consulta || !duracao || valor === undefined || pagamento === undefined) {
      return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios." })
    }

    if (!/^\d{2}:\d{2}$/.test(duracao)) {
      return res.status(400).json({ success: false, error: "Formato de duração inválido. Use hh:mm." })
    }

    const valorNumerico = Number.parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return res.status(400).json({ success: false, error: "Valor inválido." })
    }

    const pagamentoNumerico = Number.parseInt(pagamento, 10)
    if (isNaN(pagamentoNumerico) || pagamentoNumerico < 0) {
      return res.status(400).json({ success: false, error: "Dias para pagamento inválido." })
    }

    const query = `
      UPDATE convenios 
      SET nome_convenio = ?, consulta = ?, duracao = ?, valor = ?, pagamento = ? 
      WHERE id = ?
    `

    const values = [nomeConvenio, consulta, duracao, valorNumerico, pagamentoNumerico, id]

    const [result] = await db.execute(query, values)

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Convênio não encontrado." })
    }

    res.json({
      success: true,
      message: "Convênio atualizado com sucesso!",
    })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, error: "Convênio já cadastrado." })
    }
    console.error("Erro ao atualizar convênio:", error)
    res.status(500).json({ success: false, error: "Erro ao atualizar convênio." })
  }
})

// ========================
// AGENDAMENTOS
// ========================

// Listar agendamentos com ID e telefone do paciente
app.get("/api/agendamentos", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Banco de dados não conectado" })
    
    const [rows] = await db.execute(`
      SELECT 
        a.id,
        DATE_FORMAT(a.data_consulta, '%d/%m/%Y') as data_consulta,
        a.nome_paciente,
        TIME_FORMAT(a.inicio, '%H:%i') as inicio,
        TIME_FORMAT(a.fim, '%H:%i') as fim,
        a.convenio,
        a.consulta,
        a.frequencia,
        a.observacoes,
        p.telefone
      FROM agendamentos a
      LEFT JOIN pacientes p ON a.nome_paciente = p.nome_completo
      ORDER BY a.data_consulta DESC, a.inicio ASC
    `)
    res.json(rows)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    res.status(500).json({ error: "Erro ao buscar agendamentos" })
  }
})

// Cadastrar agendamento
app.post("/api/agendamentos", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const { dataConsulta, nomePaciente, telefone, inicio, fim, convenio, consulta, frequencia, observacoes } = req.body

    if (!dataConsulta || !nomePaciente || !inicio || !fim || !convenio || !consulta || !frequencia) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." })
    }

    const query = `
      INSERT INTO agendamentos (
        data_consulta, nome_paciente, telefone, inicio, fim,
        convenio, consulta, frequencia, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const values = [
      dataConsulta,
      nomePaciente,
      telefone || null,
      inicio,
      fim,
      convenio,
      consulta,
      frequencia,
      observacoes || null,
    ]

    const [result] = await db.execute(query, values)

    res.json({
      success: true,
      message: "Agendamento cadastrado com sucesso!",
      id: result.insertId,
    })
  } catch (error) {
    console.error("Erro ao cadastrar agendamento:", error)
    res.status(500).json({ error: "Erro ao cadastrar agendamento." })
  }
})

// Atualizar agendamento por ID
app.put("/api/agendamentos/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const { id } = req.params
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
    } = req.body

    if (!dataConsulta || !nomePaciente || !inicio || !fim || !convenio || !consulta || !frequencia) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." })
    }

    const query = `
      UPDATE agendamentos
      SET 
        data_consulta = ?, nome_paciente = ?, telefone = ?, inicio = ?, fim = ?,
        convenio = ?, consulta = ?, frequencia = ?, observacoes = ?
      WHERE id = ?
    `

    const values = [
      dataConsulta,
      nomePaciente,
      telefone || null,
      inicio,
      fim,
      convenio,
      consulta,
      frequencia,
      observacoes || null,
      id
    ]

    const [result] = await db.execute(query, values)

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" })
    }

    res.json({ success: true, message: "Agendamento atualizado com sucesso!" })
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error)
    res.status(500).json({ error: "Erro ao atualizar agendamento" })
  }
})

// Excluir agendamento por ID
app.delete("/api/agendamentos/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Banco de dados não conectado" })
    }

    const { id } = req.params

    const [result] = await db.execute(
      "DELETE FROM agendamentos WHERE id = ?",
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" })
    }

    res.json({ success: true, message: "Agendamento excluído com sucesso!" })
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error)
    res.status(500).json({ error: "Erro ao excluir agendamento" })
  }
})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

// Graceful shutdown
process.on("SIGINT", async () => {
  if (db) {
    await db.end()
    console.log("Conexão com MySQL encerrada.")
  }
  process.exit(0)
})