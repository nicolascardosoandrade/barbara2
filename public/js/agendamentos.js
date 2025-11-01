document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar")
  const menuIcon = document.querySelector(".menu-icon")
  const userToggle = document.getElementById("userToggle")
  const userMenu = document.getElementById("userMenu")

  // -------------------------------------------------
  // Sidebar (desktop collapsed / mobile active)
  // -------------------------------------------------
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

  // fechar sidebar ao clicar em item (mobile)
  sidebar.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth < 768 && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active")
        document.body.classList.remove("no-scroll")
      }
    })
  })

  // fechar ao clicar fora (mobile)
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

  window.addEventListener("resize", initializeSidebarState)

  // -------------------------------------------------
  // User dropdown
  // -------------------------------------------------
  userToggle.addEventListener("click", (e) => {
    e.stopPropagation()
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex"
  })
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && e.target !== userToggle) {
      userMenu.style.display = "none"
    }
  })

  window.logout = () => {
    alert("Você saiu com sucesso!")
    // window.location.href = "login.html"
  }

  // -------------------------------------------------
  // Exportar Excel
  // -------------------------------------------------
  const btnExport = document.getElementById("btnExport")
  const XLSX = window.XLSX
  btnExport.addEventListener("click", () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.table_to_sheet(document.getElementById("appointmentsTable"))
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos")
    XLSX.writeFile(wb, "agendamentos.xlsx")
  })

  // -------------------------------------------------
  // Filtro
  // -------------------------------------------------
  const btnFiltrar = document.getElementById("btnFiltrar")
  const filterPanel = document.getElementById("filterPanel")
  const closeFilter = document.getElementById("closeFilter")
  const btnLimparFiltros = document.getElementById("btnLimparFiltros")
  const btnAplicarFiltros = document.getElementById("btnAplicarFiltros")

  async function carregarConveniosFiltro() {
    try {
      const response = await fetch("/api/convenios")
      const convenios = await response.json()
      const select = document.getElementById("filterConvenio")
      select.innerHTML = '<option value="">Todos</option>'
      convenios.forEach((c) => {
        const opt = document.createElement("option")
        opt.value = c.nome_convenio
        opt.textContent = c.nome_convenio
        select.appendChild(opt)
      })
    } catch (err) {
      console.error("Erro ao carregar convênios para filtro:", err)
    }
  }

  btnFiltrar.addEventListener("click", () => {
    btnFiltrar.classList.toggle("active")
    filterPanel.classList.toggle("show")
    if (filterPanel.classList.contains("show")) carregarConveniosFiltro()
  })
  closeFilter.addEventListener("click", () => {
    filterPanel.classList.remove("show")
    btnFiltrar.classList.remove("active")
  })

  btnLimparFiltros.addEventListener("click", () => {
    document.getElementById("filterNome").value = ""
    document.getElementById("filterConvenio").value = ""
    document.getElementById("filterData").value = ""
    $("#appointmentsTable").DataTable().search("").columns().search("").draw()
  })

  btnAplicarFiltros.addEventListener("click", () => {
    const filterNome = document.getElementById("filterNome").value.toUpperCase()
    const filterConvenio = document.getElementById("filterConvenio").value
    const filterData = document.getElementById("filterData").value

    const tabela = $("#appointmentsTable").DataTable()

    $.fn.dataTable.ext.search.push((settings, data) => {
      const nome = (data[1] || "").toUpperCase()
      const convenio = data[4] || ""
      const dataConsulta = data[0] || ""

      const nomeOk = !filterNome || nome.includes(filterNome)
      const convOk = !filterConvenio || convenio === filterConvenio
      const dataOk = !filterData || dataConsulta === filterData

      return nomeOk && convOk && dataOk
    })

    tabela.draw()
    $.fn.dataTable.ext.search.pop()

    filterPanel.classList.remove("show")
    btnFiltrar.classList.remove("active")
  })

  // -------------------------------------------------
  // Selecionar (placeholder)
  // -------------------------------------------------
  const btnSelecionar = document.getElementById("btnSelecionar")
  let selectMode = false
  btnSelecionar.addEventListener("click", () => {
    selectMode = !selectMode
    btnSelecionar.classList.toggle("active")
    const icon = btnSelecionar.querySelector(".material-icons")
    icon.textContent = selectMode ? "check_box" : "check_box_outline_blank"
    alert(selectMode ? "Modo de seleção ativado." : "Modo de seleção desativado.")
  })

  // -------------------------------------------------
  // Pesquisa global
  // -------------------------------------------------
  const searchInput = document.getElementById("searchInput")
  searchInput.addEventListener("input", function () {
    $("#appointmentsTable").DataTable().search(this.value).draw()
  })

  // -------------------------------------------------
  // DataTable
  // -------------------------------------------------
  let table
  if (window.jQuery && $.fn.dataTable) {
    table = $("#appointmentsTable").DataTable({
      colReorder: true,
      paging: false,
      searching: true,
      info: false,
      language: {
        emptyTable: "Nenhum agendamento encontrado",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado",
      },
      createdRow: (row, data, dataIndex) => {
        $(row)
          .find("td")
          .each(function (i) {
            const labels = [
              "DATA CONSULTA",
              "NOME",
              "INÍCIO",
              "FIM",
              "CONVÊNIO",
              "CONSULTA",
              "FREQUÊNCIA",
              "MAIS INFO",
            ]
            $(this).attr("data-label", labels[i])
          })
      },
    })
  }

  // -------------------------------------------------
  // Carregar agendamentos
  // -------------------------------------------------
  async function carregarAgendamentos() {
    try {
      const response = await fetch("/api/agendamentos")
      if (!response.ok) throw new Error("Erro ao carregar agendamentos")
      const agendamentos = await response.json()
      table.clear()
      agendamentos.forEach((ag) => {
        table.row.add([
          ag.data_consulta,
          ag.nome_paciente,
          ag.inicio,
          ag.fim,
          ag.convenio,
          ag.consulta,
          ag.frequencia,
          `<button class="btn-info" data-agendamento='${JSON.stringify(
            ag
          )}'><span class="material-icons">info</span></button>`,
        ])
      })
      table.draw()
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar agendamentos")
    }
  }
  carregarAgendamentos()

  // -------------------------------------------------
  // Modais e formulário
  // -------------------------------------------------
  const modal = document.getElementById("modalAgendamento")
  const btnAdicionar = document.getElementById("btnAdicionar")
  const closeModal = document.getElementById("closeModal")
  const btnCancelar = document.getElementById("btnCancelar")
  const formAgendamento = document.getElementById("formAgendamento")
  const nomePacienteSelect = document.getElementById("nomePaciente")
  const telefoneInput = document.getElementById("telefone")
  const convenioSelect = document.getElementById("convenio")
  const btnSalvar = formAgendamento.querySelector(".btn-salvar")

  // variáveis de estado de edição
  let isEditMode = false
  let agendamentoId = null

  // pacientes e convênios (cache)
  let pacientes = []

  // -------------------------------------------------
  // Carregar pacientes
  // -------------------------------------------------
  async function carregarPacientes() {
    try {
      const response = await fetch("/api/pacientes")
      if (!response.ok) throw new Error("Erro ao carregar pacientes")
      pacientes = await response.json()
      nomePacienteSelect.innerHTML = '<option value="">Selecione o paciente</option>'
      pacientes.forEach((p) => {
        const opt = document.createElement("option")
        opt.value = p.nome_completo
        opt.textContent = p.nome_completo
        nomePacienteSelect.appendChild(opt)
      })
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar pacientes")
    }
  }

  // -------------------------------------------------
  // Carregar convênios
  // -------------------------------------------------
  async function carregarConvenios() {
    try {
      const response = await fetch("/api/convenios")
      if (!response.ok) throw new Error("Erro ao carregar convênios")
      const convenios = await response.json()
      convenioSelect.innerHTML = '<option value="">Selecione o convênio</option>'
      convenios.forEach((c) => {
        const opt = document.createElement("option")
        opt.value = c.nome_convenio
        opt.textContent = c.nome_convenio
        convenioSelect.appendChild(opt)
      })
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar convênios")
    }
  }

  // -------------------------------------------------
  // Abrir modal ADICIONAR
  // -------------------------------------------------
  btnAdicionar.addEventListener("click", () => {
    isEditMode = false
    agendamentoId = null
    btnSalvar.textContent = "Salvar"
    formAgendamento.reset()
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
    carregarPacientes()
    carregarConvenios()
  })

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
  })
  btnCancelar.addEventListener("click", () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    formAgendamento.reset()
  })

  // -------------------------------------------------
  // Preencher telefone e convênio ao escolher paciente
  // -------------------------------------------------
  nomePacienteSelect.addEventListener("change", () => {
    const nome = nomePacienteSelect.value
    const paciente = pacientes.find((p) => p.nome_completo === nome)
    if (paciente) {
      telefoneInput.value = paciente.telefone || ""
      convenioSelect.value = paciente.convenio || ""
    } else {
      telefoneInput.value = ""
      convenioSelect.value = ""
    }
  })

  // -------------------------------------------------
  // Submissão do formulário (POST ou PUT)
  // -------------------------------------------------
  formAgendamento.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(formAgendamento)
    const dados = Object.fromEntries(formData)

    try {
      let response
      if (isEditMode && agendamentoId) {
        // EDIÇÃO
        response = await fetch(`/api/agendamentos/${agendamentoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      } else {
        // CRIAÇÃO
        response = await fetch("/api/agendamentos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      }

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Erro ao salvar")
      }

      const result = await response.json()
      alert(result.message || (isEditMode ? "Agendamento atualizado!" : "Agendamento cadastrado!"))

      // reset
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
      formAgendamento.reset()
      isEditMode = false
      agendamentoId = null
      btnSalvar.textContent = "Salvar"

      carregarAgendamentos()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  })

  // -------------------------------------------------
  // Máscara de telefone
  // -------------------------------------------------
  telefoneInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "")
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length > 10) {
      v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    } else if (v.length > 6) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2")
    }
    e.target.value = v
  })

  // -------------------------------------------------
  // Modal de detalhes
  // -------------------------------------------------
  const modalDetalhes = document.getElementById("modalDetalhes")
  const closeDetalhes = document.getElementById("closeDetalhes")
  const btnFecharDetalhes = document.getElementById("btnFecharDetalhes")
  const btnEditarAgendamento = document.getElementById("btnEditarAgendamento")
  const btnExcluirAgendamento = document.getElementById("btnExcluirAgendamento")

  let agendamentoAtual = null

  // delegação de clique nos botões "info"
  document.getElementById("appointmentsTable").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-info")
    if (btn) {
      agendamentoAtual = JSON.parse(btn.getAttribute("data-agendamento"))
      mostrarDetalhes(agendamentoAtual)
    }
  })

  function mostrarDetalhes(ag) {
    document.getElementById("detalheData").textContent = ag.data_consulta || "-"
    document.getElementById("detalheNome").textContent = ag.nome_paciente || "-"
    document.getElementById("detalheTelefone").textContent = ag.telefone || "-"
    document.getElementById("detalheInicio").textContent = ag.inicio || "-"
    document.getElementById("detalheFim").textContent = ag.fim || "-"
    document.getElementById("detalheConvenio").textContent = ag.convenio || "-"
    document.getElementById("detalheConsulta").textContent = ag.consulta || "-"
    document.getElementById("detalheFrequencia").textContent = ag.frequencia || "-"
    document.getElementById("detalheObservacoes").textContent =
      ag.observacoes || "Nenhuma observação registrada."

    modalDetalhes.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  closeDetalhes.addEventListener("click", () => {
    modalDetalhes.classList.remove("show")
    document.body.style.overflow = "auto"
  })
  btnFecharDetalhes.addEventListener("click", () => {
    modalDetalhes.classList.remove("show")
    document.body.style.overflow = "auto"
  })

  // -------------------------------------------------
  // Editar agendamento
  // -------------------------------------------------
  btnEditarAgendamento.addEventListener("click", async () => {
    if (!agendamentoAtual?.id) return

    isEditMode = true
    agendamentoId = agendamentoAtual.id
    btnSalvar.textContent = "Atualizar"

    modalDetalhes.classList.remove("show")

    await carregarPacientes()
    await carregarConvenios()

    // converter data dd/mm/yyyy → yyyy-mm-dd
    let dataISO = ""
    if (agendamentoAtual.data_consulta) {
      const [d, m, a] = agendamentoAtual.data_consulta.split("/")
      dataISO = `${a}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }

    document.getElementById("dataConsulta").value = dataISO
    document.getElementById("nomePaciente").value = agendamentoAtual.nome_paciente || ""
    document.getElementById("telefone").value = agendamentoAtual.telefone || ""
    document.getElementById("inicio").value = agendamentoAtual.inicio || ""
    document.getElementById("fim").value = agendamentoAtual.fim || ""
    document.getElementById("convenio").value = agendamentoAtual.convenio || ""
    document.getElementById("consulta").value = agendamentoAtual.consulta || ""
    document.getElementById("frequencia").value = agendamentoAtual.frequencia || ""
    document.getElementById("observacoes").value = agendamentoAtual.observacoes || ""

    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  })

  // -------------------------------------------------
  // Excluir agendamento
  // -------------------------------------------------
  btnExcluirAgendamento.addEventListener("click", async () => {
    if (!agendamentoAtual?.id) return

    const confirma = confirm(
      `Excluir agendamento de ${agendamentoAtual.nome_paciente} em ${agendamentoAtual.data_consulta}?`
    )
    if (!confirma) return

    try {
      const response = await fetch(`/api/agendamentos/${agendamentoAtual.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Erro ao excluir")
      }
      alert("Agendamento excluído com sucesso!")
      modalDetalhes.classList.remove("show")
      document.body.style.overflow = "auto"
      carregarAgendamentos()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  })
})