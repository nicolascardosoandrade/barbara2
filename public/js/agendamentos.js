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
  const $ = window.$ // Declare the $ variable
  if (window.jQuery && window.$ && window.$.fn.dataTable) {
    window.$("#appointmentsTable").DataTable({
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

  // === Modal Agendamento ===
  const modal = document.getElementById("modalAgendamento")
  const btnAdicionar = document.getElementById("btnAdicionar")
  const closeModal = document.getElementById("closeModal")
  const btnCancelar = document.getElementById("btnCancelar")
  const formAgendamento = document.getElementById("formAgendamento")

  btnAdicionar.addEventListener("click", () => {
    modal.classList.add("show")
    document.body.style.overflow = "hidden" // Impede scroll da página
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

  // Fecha o modal ao clicar fora do conteúdo
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
      formAgendamento.reset()
    }
  })

  // Submissão do formulário
  formAgendamento.addEventListener("submit", (e) => {
    e.preventDefault()

    // Coleta os dados do formulário
    const formData = new FormData(formAgendamento)
    const dados = Object.fromEntries(formData)

    console.log("Dados do agendamento:", dados)
    alert("Agendamento cadastrado com sucesso!")

    // Fecha o modal e reseta o formulário
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
    formAgendamento.reset()
  })

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
})
