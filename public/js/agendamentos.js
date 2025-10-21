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
      sidebar.classList.remove("active") // Garante que a classe 'active' não esteja presente
      document.body.classList.remove("no-scroll") // Garante que o scroll não esteja bloqueado
    } else {
      // Em mobile, a sidebar SEMPRE começa oculta (sem a classe 'active' e sem 'collapsed')
      sidebar.classList.remove("collapsed")
      sidebar.classList.remove("active") // ESSENCIAL: Garante que 'active' seja removida ao carregar em mobile
      document.body.classList.remove("no-scroll") // Garante que o scroll não esteja bloqueado
    }
  }

  // Chame a função ao carregar a página para definir o estado inicial correto
  initializeSidebarState()

  // Toggle sidebar (collapsed for desktop, active for mobile)
  menuIcon.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      sidebar.classList.toggle("active")
      document.body.classList.toggle("no-scroll") // Impede scroll quando sidebar ativa
    } else {
      sidebar.classList.toggle("collapsed")
      sidebar.classList.remove("active") // Garante que a classe 'active' não esteja presente em desktop
      document.body.classList.remove("no-scroll") // Garante que o scroll não esteja bloqueado em desktop
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
    // Verifica se o clique não foi na sidebar e nem no ícone do menu
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
    initializeSidebarState() // Reaplica o estado correto ao redimensionar
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
  const XLSX = window.XLSX // Declare the XLSX variable
  btnExport.addEventListener("click", () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.table_to_sheet(document.getElementById("appointmentsTable"))
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos")
    XLSX.writeFile(wb, "agendamentos.xlsx")
  })

  // === Botão Filtrar ===
  const btnFiltrar = document.getElementById("btnFiltrar")
  btnFiltrar.addEventListener("click", () => {
    btnFiltrar.classList.toggle("active")
    alert("Funcionalidade de filtro será implementada aqui.")
  })

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
    const $ = window.$ // Declare the $ variable
    if (window.jQuery && $.fn.dataTable) {
      const tabela = $("#appointmentsTable").DataTable()
      tabela.search(this.value).draw()
    }
  })

  // Inicializa DataTable com suporte a colunas arrastáveis
  let table;
  const $ = window.$ // Declare the $ variable
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
            const labels = ["DATA CONSULTA", "NOME", "INÍCIO", "FIM", "CONVÊNIO", "CONSULTA", "FREQUÊNCIA", "OBS."]
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
      const response = await fetch('/api/agendamentos');
      if (!response.ok) throw new Error('Erro ao carregar agendamentos');
      const agendamentos = await response.json();
      table.clear();
      agendamentos.forEach(ag => {
        table.row.add([
          ag.data_consulta,
          ag.nome_paciente,
          ag.inicio,
          ag.fim,
          ag.convenio,
          ag.consulta,
          ag.frequencia,
          ag.observacoes ? ag.observacoes : '<span class="material-icons">edit</span>'
        ]).draw();
      });
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      alert('Erro ao carregar agendamentos');
    }
  }

  // Carrega agendamentos ao iniciar
  carregarAgendamentos();

  // === Modal Agendamento ===
  const modal = document.getElementById("modalAgendamento")
  const btnAdicionar = document.getElementById("btnAdicionar")
  const closeModal = document.getElementById("closeModal")
  const btnCancelar = document.getElementById("btnCancelar")
  const formAgendamento = document.getElementById("formAgendamento")
  const nomePacienteSelect = document.getElementById("nomePaciente")
  const telefoneInput = document.getElementById("telefone")
  const convenioSelect = document.getElementById("convenio")

  let pacientes = []; // Armazena a lista de pacientes

  // Função para carregar pacientes e popular o select
  async function carregarPacientes() {
    try {
      const response = await fetch('/api/pacientes');
      if (!response.ok) throw new Error('Erro ao carregar pacientes');
      pacientes = await response.json();
      nomePacienteSelect.innerHTML = '<option value="">Selecione o paciente</option>';
      pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.nome_completo;
        option.textContent = p.nome_completo;
        nomePacienteSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      alert('Erro ao carregar pacientes');
    }
  }

  // Função para carregar convênios e popular o select
  async function carregarConvenios() {
    try {
      const response = await fetch('/api/convenios');
      if (!response.ok) throw new Error('Erro ao carregar convênios');
      const convenios = await response.json();
      convenioSelect.innerHTML = '<option value="">Selecione o convênio</option>';
      convenios.forEach(c => {
        const option = document.createElement('option');
        option.value = c.nome_convenio;
        option.textContent = c.nome_convenio;
        convenioSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar convênios:', error);
      alert('Erro ao carregar convênios');
    }
  }

  btnAdicionar.addEventListener("click", () => {
    modal.classList.add("show")
    document.body.style.overflow = "hidden" // Impede scroll da página
    carregarPacientes(); // Carrega pacientes ao abrir o modal
    carregarConvenios(); // Carrega convênios ao abrir o modal
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

  // Ao selecionar paciente, preencher telefone e buscar convênios
  nomePacienteSelect.addEventListener('change', async (e) => {
    const selectedNome = e.target.value;
    const paciente = pacientes.find(p => p.nome_completo === selectedNome);
    if (paciente) {
      telefoneInput.value = paciente.telefone || '';
      // Limpa e recarrega os convênios
      convenioSelect.innerHTML = '<option value="">Selecione o convênio</option>';
      await carregarConvenios();
      convenioSelect.value = paciente.convenio || '';
    } else {
      telefoneInput.value = '';
      convenioSelect.value = '';
    }
  });

  // Submissão do formulário
  formAgendamento.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Coleta os dados do formulário
    const formData = new FormData(formAgendamento)
    const dados = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar agendamento');
      }

      alert("Agendamento cadastrado com sucesso!")

      // Fecha o modal e reseta o formulário
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
      formAgendamento.reset()

      // Recarrega a tabela
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao cadastrar agendamento:', error);
      alert(error.message);
    }
  })

  const telefoneInputElement = document.getElementById("telefone")
  telefoneInputElement.addEventListener("input", (e) => {
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
})