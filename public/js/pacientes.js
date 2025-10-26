document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar")
  const menuIcon = document.querySelector(".menu-icon")
  const userToggle = document.getElementById("userToggle")
  const userMenu = document.getElementById("userMenu")

  // Função para aplicar o estado inicial da sidebar com base no tamanho da tela
  function initializeSidebarState() {
    if (window.innerWidth >= 768) {
      sidebar.classList.add("collapsed")
      sidebar.classList.remove("active")
      document.body.classList.remove("no-scroll")
    } else {
      sidebar.classList.remove("collapsed")
      sidebar.classList.remove("active")
      document.body.classList.remove("no-scroll")
    }
  }

  initializeSidebarState()

  // Toggle sidebar
  menuIcon.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      sidebar.classList.toggle("active")
      document.body.classList.toggle("no-scroll")
    } else {
      sidebar.classList.toggle("collapsed")
      sidebar.classList.remove("active")
      document.body.classList.remove("no-scroll")
    }
  })

  // Fecha sidebar ao clicar em item (mobile)
  sidebar.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth < 768 && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active")
        document.body.classList.remove("no-scroll")
      }
    })
  })

  // Fecha sidebar ao clicar fora (mobile)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 768 &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuIcon.contains(e.target)
    ) {
      sidebar.classList.remove("active")
      document.body.classList.remove("no-scroll")
    }
  })

  // Gerencia sidebar ao redimensionar
  window.addEventListener("resize", initializeSidebarState)

  // User dropdown
  userToggle.addEventListener("click", (e) => {
    e.stopPropagation()
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex"
  })

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && e.target !== userToggle) {
      userMenu.style.display = "none"
    }
  })

  // Logout
  window.logout = () => {
    alert("Você saiu com sucesso!")
    // window.location.href = "login.html";
  }

  // === Modal e Formulário ===
  const btnAdicionar = document.getElementById("btnAdicionar")
  const modal = document.getElementById("modalPaciente")
  const closeModal = document.getElementById("closeModal")
  const btnCancelar = document.getElementById("btnCancelar")
  const formPaciente = document.getElementById("formPaciente")
  const nomeCompletoInput = document.getElementById("nomeCompleto")
  const responsavelInput = document.getElementById("responsavel")
  const cepInput = document.getElementById("cep")
  const numeroInput = document.getElementById("numero")
  const convenioSelect = document.getElementById("convenio")

  const modalDetalhes = document.getElementById("modalDetalhes")
  const closeModalDetalhes = document.getElementById("closeModalDetalhes")
  const btnFecharDetalhes = document.getElementById("btnFecharDetalhes")
  const btnEditarPaciente = document.getElementById("btnEditarPaciente")
  let pacienteAtual = null

  // Função para carregar convênios do banco
  async function carregarConvenios() {
    try {
      const response = await fetch("/api/convenios")
      const convenios = await response.json()

      // Limpa o select, mantendo apenas a opção padrão
      convenioSelect.innerHTML = '<option value="">Selecione</option>'

      // Adiciona os convênios do banco ao select
      convenios.forEach((convenio) => {
        const option = document.createElement("option")
        option.value = convenio.nome_convenio
        option.textContent = convenio.nome_convenio
        convenioSelect.appendChild(option)
      })
    } catch (error) {
      console.error("Erro ao carregar convênios:", error)
      alert("Erro ao carregar lista de convênios.")
    }
  }

  async function carregarConveniosFiltro() {
    try {
      const response = await fetch("/api/convenios")
      const convenios = await response.json()

      const filterConvenioSelect = document.getElementById("filterConvenio")
      filterConvenioSelect.innerHTML = '<option value="">Todos</option>'

      convenios.forEach((convenio) => {
        const option = document.createElement("option")
        option.value = convenio.nome_convenio
        option.textContent = convenio.nome_convenio
        filterConvenioSelect.appendChild(option)
      })
    } catch (error) {
      console.error("Erro ao carregar convênios para filtro:", error)
    }
  }

  btnAdicionar.addEventListener("click", () => {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
    formPaciente.reset()
    delete formPaciente.dataset.editMode
    delete formPaciente.dataset.pacienteId
    carregarConvenios()
  })

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    formPaciente.reset()
    delete formPaciente.dataset.editMode
    delete formPaciente.dataset.pacienteId
  })

  btnCancelar.addEventListener("click", () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    formPaciente.reset()
    delete formPaciente.dataset.editMode
    delete formPaciente.dataset.pacienteId
  })

  closeModalDetalhes.addEventListener("click", () => {
    modalDetalhes.classList.remove("show")
    document.body.style.overflow = "auto"
    pacienteAtual = null
  })

  btnFecharDetalhes.addEventListener("click", () => {
    modalDetalhes.classList.remove("show")
    document.body.style.overflow = "auto"
    pacienteAtual = null
  })

  btnEditarPaciente.addEventListener("click", () => {
    if (!pacienteAtual) return

    // Fecha o modal de detalhes
    modalDetalhes.classList.remove("show")

    // Preenche o formulário de edição com os dados do paciente
    document.getElementById("nomeCompleto").value = pacienteAtual.nome_completo
    document.getElementById("genero").value = pacienteAtual.genero || "" // Adiciona o campo gênero
    document.getElementById("responsavel").value = pacienteAtual.responsavel || ""
    document.getElementById("telefone").value = pacienteAtual.telefone
    document.getElementById("email").value = pacienteAtual.email
    document.getElementById("dataNascimento").value = pacienteAtual.data_nascimento
    document.getElementById("cpf").value = pacienteAtual.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    document.getElementById("cep").value = pacienteAtual.cep.replace(/(\d{5})(\d{3})/, "$1-$2")
    document.getElementById("logradouro").value = pacienteAtual.logradouro
    document.getElementById("numero").value = pacienteAtual.numero
    document.getElementById("bairro").value = pacienteAtual.bairro
    document.getElementById("cidade").value = pacienteAtual.cidade
    document.getElementById("estado").value = pacienteAtual.estado

    // Carrega os convênios e abre o modal de edição
    carregarConvenios().then(() => {
      document.getElementById("convenio").value = pacienteAtual.convenio
      document.getElementById("situacao").value = pacienteAtual.situacao
      modal.classList.add("show")
      document.body.style.overflow = "hidden"

      // Marca que estamos em modo de edição
      formPaciente.dataset.editMode = "true"
      formPaciente.dataset.pacienteId = pacienteAtual.id
    })
  })

  // Forçar letras maiúsculas nos campos nomeCompleto e responsavel
  nomeCompletoInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase()
  })

  responsavelInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase()
  })

  // Forçar apenas números no campo CEP com máscara
  cepInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 8) value = value.slice(0, 8)

    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, "$1-$2")
    }

    e.target.value = value

    if (value.replace(/\D/g, "").length === 8) {
      buscarEnderecoPorCep(value.replace(/\D/g, ""))
    }
  })

  // Forçar apenas números no campo Número
  numeroInput.addEventListener("input", (e) => {
    const value = e.target.value.replace(/\D/g, "")
    e.target.value = value
  })

  // Função para calcular idade
  function calcularIdade(dataNasc) {
    const hoje = new Date()
    const nascimento = new Date(dataNasc)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    const dia = hoje.getDate() - nascimento.getDate()

    if (mes < 0 || (mes === 0 && dia < 0)) {
      idade--
    }

    const anos = idade
    const meses = mes < 0 ? mes + 12 : mes
    const dias = dia < 0 ? dia + new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate() : dia

    return `${anos} anos, ${meses} meses, ${dias} dias`
  }

  formPaciente.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(formPaciente)
    const dados = Object.fromEntries(formData)

    const isEditMode = formPaciente.dataset.editMode === "true"
    const pacienteId = formPaciente.dataset.pacienteId

    try {
      const url = isEditMode ? `/api/pacientes/${pacienteId}` : "/api/pacientes"
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomeCompleto: dados.nomeCompleto.toUpperCase(),
          genero: dados.genero, // Adiciona o campo gênero
          responsavel: dados.responsavel ? dados.responsavel.toUpperCase() : null,
          telefone: dados.telefone,
          email: dados.email,
          dataNascimento: dados.dataNascimento,
          cpf: dados.cpf,
          convenio: dados.convenio,
          cep: dados.cep,
          logradouro: dados.logradouro,
          numero: dados.numero,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
          situacao: dados.situacao,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(result.message)

        // Recarrega a lista de pacientes
        await carregarPacientes()

        modal.classList.remove("show")
        document.body.style.overflow = "auto"
        formPaciente.reset()

        // Limpa os dados de edição
        delete formPaciente.dataset.editMode
        delete formPaciente.dataset.pacienteId
        pacienteAtual = null
      } else {
        alert("Erro: " + result.error)
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      alert("Erro ao conectar com o servidor.")
    }
  })

  // Máscara para CPF
  const cpfInput = document.getElementById("cpf")
  cpfInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3")
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2")
    }

    e.target.value = value
  })

  // Máscara para telefone
  const telefoneInput = document.getElementById("telefone")
  telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
    }

    e.target.value = value
  })

  async function buscarEnderecoPorCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        document.getElementById("logradouro").value = data.logradouro || ""
        document.getElementById("bairro").value = data.bairro || ""
        document.getElementById("cidade").value = data.localidade || ""
        document.getElementById("estado").value = data.uf || ""
      } else {
        alert("CEP não encontrado!")
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    }
  }

  // Botão Filtrar
  const btnFiltrar = document.getElementById("btnFiltrar")
  const filterPanel = document.getElementById("filterPanel")
  const closeFilter = document.getElementById("closeFilter")
  const btnLimparFiltros = document.getElementById("btnLimparFiltros")
  const btnAplicarFiltros = document.getElementById("btnAplicarFiltros")

  btnFiltrar.addEventListener("click", () => {
    btnFiltrar.classList.toggle("active")
    filterPanel.classList.toggle("show")
    if (filterPanel.classList.contains("show")) {
      carregarConveniosFiltro()
    }
  })

  closeFilter.addEventListener("click", () => {
    filterPanel.classList.remove("show")
    btnFiltrar.classList.remove("active")
  })

  btnLimparFiltros.addEventListener("click", () => {
    document.getElementById("filterNome").value = ""
    document.getElementById("filterConvenio").value = ""
    document.getElementById("filterSituacao").value = ""

    // Limpa os filtros do DataTable
    const tabela = window.$("#relatorio-pacientes").DataTable()
    tabela.search("").columns().search("").draw()
  })

  btnAplicarFiltros.addEventListener("click", () => {
    const filterNome = document.getElementById("filterNome").value.toUpperCase()
    const filterConvenio = document.getElementById("filterConvenio").value
    const filterSituacao = document.getElementById("filterSituacao").value

    const tabela = window.$("#relatorio-pacientes").DataTable()

    // Aplica filtros customizados
    window.$.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
      const nome = data[0] || ""
      const convenio = data[3] || ""
      const situacao = data[4] || ""

      const nomeMatch = !filterNome || nome.toUpperCase().includes(filterNome)
      const convenioMatch = !filterConvenio || convenio === filterConvenio
      const situacaoMatch = !filterSituacao || situacao === filterSituacao

      return nomeMatch && convenioMatch && situacaoMatch
    })

    tabela.draw()

    // Remove o filtro customizado após aplicar
    window.$.fn.dataTable.ext.search.pop()

    filterPanel.classList.remove("show")
    btnFiltrar.classList.remove("active")
  })

  // Botão Selecionar
  const btnSelecionar = document.getElementById("btnSelecionar")
  let selectMode = false
  btnSelecionar.addEventListener("click", () => {
    selectMode = !selectMode
    btnSelecionar.classList.toggle("active")
    const icon = btnSelecionar.querySelector(".material-icons")
    icon.textContent = selectMode ? "check_box" : "check_box_outline_blank"

    if (selectMode) {
      alert("Modo de seleção ativado. Funcionalidade será implementada.")
    } else {
      alert("Modo de seleção desativado.")
    }
  })

  // Pesquisa no cabeçalho
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      if (window.jQuery && window.$ && window.$.fn.dataTable) {
        const tabela = window.$("#relatorio-pacientes").DataTable()
        tabela.search(this.value).draw()
      }
    })
  }

  if (window.jQuery && window.$ && window.$.fn.dataTable) {
    const tabela = window.$("#relatorio-pacientes").DataTable({
      colReorder: true,
      paging: true,
      searching: true,
      info: true,
      language: {
        emptyTable: "Nenhum paciente encontrado",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 a 0 de 0 registros",
        infoFiltered: "(filtrado de _MAX_ registros no total)",
        paginate: {
          first: "Primeiro",
          last: "Último",
          next: "Próximo",
          previous: "Anterior",
        },
      },
      createdRow: (row, data, dataIndex) => {
        window
          .$(row)
          .find("td")
          .each(function (index) {
            const labels = ["PACIENTE", "IDADE", "CPF", "CONVÊNIO", "SITUAÇÃO", "EXTRATO DOS AGENDAMENTOS", "AÇÕES"]
            window.$(this).attr("data-label", labels[index])
          })
      },
    })
  } else {
    console.warn("jQuery ou DataTables não carregados corretamente.")
  }

  window.verMaisPaciente = async (pacienteId) => {
    const paciente = window.todosOsPacientes.find((p) => p.id === pacienteId)
    if (!paciente) {
      alert("Paciente não encontrado!")
      return
    }

    pacienteAtual = paciente

    // Preenche os dados do modal
    document.getElementById("detalheNome").textContent = paciente.nome_completo
    document.getElementById("detalheGenero").textContent = paciente.genero || "Não informado" // Adiciona o campo gênero
    document.getElementById("detalheResponsavel").textContent = paciente.responsavel || "Não informado"
    document.getElementById("detalheTelefone").textContent = paciente.telefone
    document.getElementById("detalheEmail").textContent = paciente.email

    // Formata a data de nascimento
    const dataNasc = new Date(paciente.data_nascimento + "T00:00:00")
    const dataFormatada = dataNasc.toLocaleDateString("pt-BR")
    document.getElementById("detalheDataNascimento").textContent = dataFormatada
    document.getElementById("detalheIdade").textContent = calcularIdade(paciente.data_nascimento)

    document.getElementById("detalheCpf").textContent = paciente.cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4",
    )
    document.getElementById("detalheConvenio").textContent = paciente.convenio
    document.getElementById("detalheSituacao").textContent = paciente.situacao

    // Endereço
    document.getElementById("detalheCep").textContent = paciente.cep.replace(/(\d{5})(\d{3})/, "$1-$2")
    document.getElementById("detalheLogradouro").textContent = paciente.logradouro
    document.getElementById("detalheNumero").textContent = paciente.numero
    document.getElementById("detalheBairro").textContent = paciente.bairro
    document.getElementById("detalheCidade").textContent = paciente.cidade
    document.getElementById("detalheEstado").textContent = paciente.estado

    modalDetalhes.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  window.todosOsPacientes = []

  async function carregarPacientes() {
    try {
      const response = await fetch("/api/pacientes")
      const pacientes = await response.json()

      window.todosOsPacientes = pacientes

      const tabela = window.$("#relatorio-pacientes").DataTable()
      tabela.clear()

      pacientes.forEach((p) => {
        tabela.row.add([
          p.nome_completo.toUpperCase(),
          calcularIdade(p.data_nascimento),
          p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
          p.convenio,
          p.situacao,
          '<span class="material-icons">description</span>',
          `<button class="btn-ver-mais" onclick="verMaisPaciente(${p.id})" title="Ver Mais">
            <span class="material-icons">visibility</span>
          </button>`,
        ])
      })

      tabela.draw()
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error)
    }
  }

  carregarPacientes()
})