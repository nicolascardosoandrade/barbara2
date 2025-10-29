document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar")
  const menuIcon = document.querySelector(".menu-icon")
  const userToggle = document.getElementById("userToggle")
  const userMenu = document.getElementById("userMenu")

  // Função para aplicar o estado inicial da sidebar com base no tamanho da tela
  function initializeSidebarState() {
    if (window.innerWidth >= 768) {
      // Em desktop, a sidebar começa colapsada
      sidebar.classList.add("collapsed")
      sidebar.classList.remove("active")
      document.body.classList.remove("no-scroll")
    } else {
      // Em mobile, a sidebar SEMPRE começa oculta
      sidebar.classList.remove("collapsed")
      sidebar.classList.remove("active")
      document.body.classList.remove("no-scroll")
    }
  }

  // Chame a função ao carregar a página para definir o estado inicial correto
  initializeSidebarState()

  // Toggle sidebar (collapsed for desktop, active for mobile)
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

  // Fecha a sidebar ao clicar em um item da lista em dispositivos móveis
  sidebar.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth < 768 && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active")
        document.body.classList.remove("no-scroll")
      }
    })
  })

  // Fecha a sidebar ao clicar fora dela em dispositivos móveis
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

  // Gerencia a sidebar ao redimensionar a janela
  window.addEventListener("resize", () => {
    initializeSidebarState()
  })

  // User dropdown
  userToggle.addEventListener("click", (e) => {
    e.stopPropagation()
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex"
  })

  // Fecha dropdown ao clicar fora
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && e.target !== userToggle) {
      userMenu.style.display = "none"
    }
  })

  // Logout function
  window.logout = () => {
    alert("Você saiu com sucesso!")
    // window.location.href = "login.html";
  }

  // === Botão Exportar ===
  const btnExport = document.getElementById("btnExport")
  const XLSX = window.XLSX
  btnExport.addEventListener("click", () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.table_to_sheet(document.getElementById("appointmentsTable"))
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos")
    XLSX.writeFile(wb, "agendamentos.xlsx")
  })

  // === Botão Filtrar ===
  const btnFiltrar = document.getElementById("btnFiltrar")
  const filterPanel = document.getElementById("filterPanel")
  const closeFilter = document.getElementById("closeFilter")
  const btnLimparFiltros = document.getElementById("btnLimparFiltros")
  const btnAplicarFiltros = document.getElementById("btnAplicarFiltros")

  async function carregarConveniosFiltro() {
    try {
      const response = await fetch("/api/convenios");
      const convenios = await response.json();
      const filterConvenioSelect = document.getElementById("filterConvenio");
      filterConvenioSelect.innerHTML = '<option value="">Todos</option>';
      convenios.forEach((c) => {
        const option = document.createElement("option");
        option.value = c.nome_convenio;
        option.textContent = c.nome_convenio;
        filterConvenioSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar convênios para filtro:", error);
    }
  }

  btnFiltrar.addEventListener("click", () => {
    btnFiltrar.classList.toggle("active");
    filterPanel.classList.toggle("show");
    if (filterPanel.classList.contains("show")) {
      carregarConveniosFiltro();
    }
  });

  closeFilter.addEventListener("click", () => {
    filterPanel.classList.remove("show");
    btnFiltrar.classList.remove("active");
  });

  btnLimparFiltros.addEventListener("click", () => {
    document.getElementById("filterNome").value = "";
    document.getElementById("filterConvenio").value = "";
    document.getElementById("filterData").value = "";
    const tabela = $("#appointmentsTable").DataTable();
    tabela.search("").columns().search("").draw();
  });

  btnAplicarFiltros.addEventListener("click", () => {
    const filterNome = document.getElementById("filterNome").value.toUpperCase();
    const filterConvenio = document.getElementById("filterConvenio").value;
    const filterData = document.getElementById("filterData").value;

    const tabela = $("#appointmentsTable").DataTable();

    $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
      const nome = data[1] || ""; // Coluna "NOME"
      const convenio = data[4] || ""; // Coluna "CONVÊNIO"
      const dataConsulta = data[0] || ""; // Coluna "DATA CONSULTA"

      const nomeMatch = !filterNome || nome.toUpperCase().includes(filterNome);
      const convenioMatch = !filterConvenio || convenio === filterConvenio;
      const dataMatch = !filterData || dataConsulta === filterData;

      return nomeMatch && convenioMatch && dataMatch;
    });

    tabela.draw();

    $.fn.dataTable.ext.search.pop();

    filterPanel.classList.remove("show");
    btnFiltrar.classList.remove("active");
  });

  // === Botão Selecionar ===
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

  // === Integração com campo de pesquisa do cabeçalho ===
  const searchInput = document.getElementById("searchInput")
  searchInput.addEventListener("input", function () {
    const $ = window.$
    if (window.jQuery && $.fn.dataTable) {
      const tabela = $("#appointmentsTable").DataTable()
      tabela.search(this.value).draw()
    }
  })

  // Inicializa DataTable com suporte a colunas arrastáveis
  let table
  const $ = window.$
  if (window.jQuery && window.$ && window.$.fn.dataTable) {
    table = window.$("#appointmentsTable").DataTable({
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
          .each(function (index) {
            const labels = ["DATA CONSULTA", "NOME", "INÍCIO", "FIM", "CONVÊNIO", "CONSULTA", "FREQUÊNCIA", "MAIS INFO"]
            $(this).attr("data-label", labels[index])
          })
      },
    })
  } else {
    console.warn("jQuery ou DataTables não carregados corretamente.")
  }

  // Função para carregar agendamentos do banco de dados
  async function carregarAgendamentos() {
    try {
      const response = await fetch("/api/agendamentos")
      if (!response.ok) throw new Error("Erro ao carregar agendamentos")
      const agendamentos = await response.json()
      table.clear()
      agendamentos.forEach((ag) => {
        table.row
          .add([
            ag.data_consulta,
            ag.nome_paciente,
            ag.inicio,
            ag.fim,
            ag.convenio,
            ag.consulta,
            ag.frequencia,
            '<button class="btn-info" data-agendamento=\'' +
              JSON.stringify(ag) +
              '\'><span class="material-icons">info</span></button>',
          ])
          .draw()
      })
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error)
      alert("Erro ao carregar agendamentos")
    }
  }

  // Carrega agendamentos ao iniciar
  carregarAgendamentos()

  // === Modal Agendamento ===
  const modal = document.getElementById("modalAgendamento")
  const btnAdicionar = document.getElementById("btnAdicionar")
  const closeModal = document.getElementById("closeModal")
  const btnCancelar = document.getElementById("btnCancelar")
  const formAgendamento = document.getElementById("formAgendamento")
  const nomePacienteSelect = document.getElementById("nomePaciente")
  const telefoneInput = document.getElementById("telefone")
  const convenioSelect = document.getElementById("convenio")

  let pacientes = []

  // Função para carregar pacientes e popular o select
  async function carregarPacientes() {
    try {
      const response = await fetch("/api/pacientes")
      if (!response.ok) throw new Error("Erro ao carregar pacientes")
      pacientes = await response.json()
      nomePacienteSelect.innerHTML = '<option value="">Selecione o paciente</option>'
      pacientes.forEach((p) => {
        const option = document.createElement("option")
        option.value = p.nome_completo
        option.textContent = p.nome_completo
        nomePacienteSelect.appendChild(option)
      })
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error)
      alert("Erro ao carregar pacientes")
    }
  }

  // Função para carregar convênios e popular o select
  async function carregarConvenios() {
    try {
      const response = await fetch("/api/convenios")
      if (!response.ok) throw new Error("Erro ao carregar convênios")
      const convenios = await response.json()
      convenioSelect.innerHTML = '<option value="">Selecione o convênio</option>'
      convenios.forEach((c) => {
        const option = document.createElement("option")
        option.value = c.nome_convenio
        option.textContent = c.nome_convenio
        convenioSelect.appendChild(option)
      })
    } catch (error) {
      console.error("Erro ao carregar convênios:", error)
      alert("Erro ao carregar convênios")
    }
  }

  btnAdicionar.addEventListener("click", () => {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
    carregarPacientes()
    carregarConvenios()
  })

  // Fecha o modal ao clicar no X
  closeModal.addEventListener("click", () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
  })

  // Fecha o modal ao clicar no botão Cancelar
  btnCancelar.addEventListener("click", () => {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    formAgendamento.reset()
  })

  // Comentado para evitar fechar o modal ao clicar fora (requisito)
  // modal.addEventListener("click", (e) => {
  //   if (e.target === modal) {
  //     modal.classList.remove("show")
  //     document.body.style.overflow = "auto"
  //     formAgendamento.reset()
  //   }
  // })

  // Ao selecionar paciente, preencher telefone e buscar convênios
  nomePacienteSelect.addEventListener("change", async (e) => {
    const selectedNome = e.target.value
    const paciente = pacientes.find((p) => p.nome_completo === selectedNome)
    if (paciente) {
      telefoneInput.value = paciente.telefone || ""
      convenioSelect.innerHTML = '<option value="">Selecione o convênio</option>'
      await carregarConvenios()
      convenioSelect.value = paciente.convenio || ""
    } else {
      telefoneInput.value = ""
      convenioSelect.value = ""
    }
  })

  // Submissão do formulário
  formAgendamento.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(formAgendamento)
    const dados = Object.fromEntries(formData)

    try {
      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao cadastrar agendamento")
      }

      alert("Agendamento cadastrado com sucesso!")

      modal.classList.remove("show")
      document.body.style.overflow = "auto"
      formAgendamento.reset()

      carregarAgendamentos()
    } catch (error) {
      console.error("Erro ao cadastrar agendamento:", error)
      alert(error.message)
    }
  })

  // Máscara de telefone
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

  const modalDetalhes = document.getElementById("modalDetalhes")
  const closeDetalhes = document.getElementById("closeDetalhes")
  const btnFecharDetalhes = document.getElementById("btnFecharDetalhes")
  const btnEditarAgendamento = document.getElementById("btnEditarAgendamento")

  let agendamentoAtual = null

  // Event delegation for info buttons
  document.getElementById("appointmentsTable").addEventListener("click", (e) => {
    const btnInfo = e.target.closest(".btn-info")
    if (btnInfo) {
      const agendamentoData = btnInfo.getAttribute("data-agendamento")
      agendamentoAtual = JSON.parse(agendamentoData)
      mostrarDetalhes(agendamentoAtual)
    }
  })

  function mostrarDetalhes(agendamento) {
    document.getElementById("detalheData").textContent = agendamento.data_consulta || "-"
    document.getElementById("detalheNome").textContent = agendamento.nome_paciente || "-"
    document.getElementById("detalheTelefone").textContent = agendamento.telefone || "-"
    document.getElementById("detalheInicio").textContent = agendamento.inicio || "-"
    document.getElementById("detalheFim").textContent = agendamento.fim || "-"
    document.getElementById("detalheConvenio").textContent = agendamento.convenio || "-"
    document.getElementById("detalheConsulta").textContent = agendamento.consulta || "-"
    document.getElementById("detalheFrequencia").textContent = agendamento.frequencia || "-"
    document.getElementById("detalheObservacoes").textContent =
      agendamento.observacoes || "Nenhuma observação registrada."

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

  // Comentado para evitar fechar o modal de detalhes ao clicar fora (requisito)
  // modalDetalhes.addEventListener("click", (e) => {
  //   if (e.target === modalDetalhes) {
  //     modalDetalhes.classList.remove("show")
  //     document.body.style.overflow = "auto"
  //   }
  // })

  btnEditarAgendamento.addEventListener("click", () => {
    if (agendamentoAtual) {
      // Fecha o modal de detalhes
      modalDetalhes.classList.remove("show")

      // Preenche o formulário com os dados do agendamento
      document.getElementById("dataConsulta").value = agendamentoAtual.data_consulta_raw || ""
      document.getElementById("nomePaciente").value = agendamentoAtual.nome_paciente || ""
      document.getElementById("telefone").value = agendamentoAtual.telefone || ""
      document.getElementById("inicio").value = agendamentoAtual.inicio || ""
      document.getElementById("fim").value = agendamentoAtual.fim || ""
      document.getElementById("convenio").value = agendamentoAtual.convenio || ""
      document.getElementById("consulta").value = agendamentoAtual.consulta || ""
      document.getElementById("frequencia").value = agendamentoAtual.frequencia || ""
      document.getElementById("observacoes").value = agendamentoAtual.observacoes || ""

      // Abre o modal de edição
      modal.classList.add("show")
      carregarPacientes()
      carregarConvenios()
    }
  })
})