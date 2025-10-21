document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.querySelector(".menu-icon");
  const userToggle = document.getElementById("userToggle");
  const userMenu = document.getElementById("userMenu");

  // Função para aplicar o estado inicial da sidebar
  function initializeSidebarState() {
    if (window.innerWidth >= 768) {
      sidebar.classList.add("collapsed");
      sidebar.classList.remove("active");
      document.body.classList.remove("no-scroll");
    } else {
      sidebar.classList.remove("collapsed");
      sidebar.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  }

  initializeSidebarState();

  // Toggle sidebar
  menuIcon.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      sidebar.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    } else {
      sidebar.classList.toggle("collapsed");
      sidebar.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });

  // Fecha sidebar ao clicar em item (mobile)
  sidebar.querySelectorAll("nav ul li a").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth < 768 && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  });

  // Fecha sidebar ao clicar fora (mobile)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 768 &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuIcon.contains(e.target)
    ) {
      sidebar.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });

  // Gerencia sidebar ao redimensionar
  window.addEventListener("resize", initializeSidebarState);

  // User dropdown
  userToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && e.target !== userToggle) {
      userMenu.style.display = "none";
    }
  });

  // Logout
  window.logout = () => {
    alert("Você saiu com sucesso!");
    // window.location.href = "login.html";
  };

  // Modal e Formulário
  const modal = document.getElementById("modalConvenio");
  const btnAdicionar = document.getElementById("btnAdicionar");
  const closeModal = document.getElementById("closeModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const formConvenio = document.getElementById("formConvenio");
  const inputDuracao = document.getElementById("duracao");
  const inputValor = document.getElementById("valor");
  const inputNomeConvenio = document.getElementById("nomeConvenio");

  btnAdicionar.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    formConvenio.reset();
    // Restaurar comportamento padrão do formulário para cadastro
    formConvenio.onsubmit = submitCadastro;
  });

  function fecharModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    formConvenio.reset();
    formConvenio.onsubmit = submitCadastro; // Resetar para cadastro ao fechar
  }

  closeModal.addEventListener("click", fecharModal);
  btnCancelar.addEventListener("click", fecharModal);

  // Forçar letras maiúsculas no campo nomeConvenio
  inputNomeConvenio.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  // Máscara para duração (hh:mm)
  inputDuracao.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.substring(0, 2) + ":" + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // Máscara para valor (R$ 0,00)
  inputValor.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 0) value = "0";
    value = (Number.parseInt(value) / 100).toFixed(2).replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    e.target.value = `R$ ${value}`;
  });

  // Função para cadastro de convênio
  async function submitCadastro(e) {
    e.preventDefault();

    const formData = new FormData(formConvenio);
    const dados = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/convenios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeConvenio: dados.nomeConvenio.toUpperCase(), // Garantir maiúsculas
          consulta: dados.consulta,
          duracao: dados.duracao,
          valor: dados.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim(),
          pagamento: parseInt(dados.pagamento, 10)
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        const tabela = $("#conveniosTable").DataTable();
        tabela.row.add([
          dados.nomeConvenio.toUpperCase(), // Exibir em maiúsculas
          dados.consulta,
          dados.duracao,
          `R$ ${parseFloat(dados.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()).toFixed(2).replace('.', ',')}`,
          dados.pagamento,
          `<span class="material-icons" onclick="editConvenio(${result.id}, this)">edit</span>`
        ]).draw();
        fecharModal();
      } else {
        alert("Erro: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  // Submissão do formulário (cadastro)
  formConvenio.addEventListener("submit", submitCadastro);

  // Botão Filtrar
  const btnFiltrar = document.getElementById("btnFiltrar");
  btnFiltrar.addEventListener("click", () => {
    btnFiltrar.classList.toggle("active");
    alert("Funcionalidade de filtro será implementada aqui.");
  });

  // Botão Selecionar
  const btnSelecionar = document.getElementById("btnSelecionar");
  let selectMode = false;
  btnSelecionar.addEventListener("click", () => {
    selectMode = !selectMode;
    btnSelecionar.classList.toggle("active");
    const icon = btnSelecionar.querySelector(".material-icons");
    icon.textContent = selectMode ? "check_box" : "check_box_outline_blank";

    if (selectMode) {
      alert("Modo de seleção ativado. Funcionalidade será implementada.");
    } else {
      alert("Modo de seleção desativado.");
    }
  });

  // Pesquisa no cabeçalho
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      if (window.jQuery && window.$ && window.$.fn.dataTable) {
        const tabela = window.$("#conveniosTable").DataTable();
        tabela.search(this.value).draw();
      }
    });
  }

  // Função para carregar convênios
  async function carregarConvenios() {
    try {
      const response = await fetch('/api/convenios');
      const convenios = await response.json();

      const tabela = $("#conveniosTable").DataTable();
      tabela.clear();
      convenios.forEach(c => {
        tabela.row.add([
          c.nome_convenio.toUpperCase(), // Garantir maiúsculas na exibição
          c.consulta,
          c.duracao,
          `R$ ${parseFloat(c.valor).toFixed(2).replace('.', ',')}`,
          c.pagamento,
          `<span class="material-icons" onclick="editConvenio(${c.id}, this)">edit</span>`
        ]);
      });
      tabela.draw();
    } catch (error) {
      console.error("Erro ao carregar convênios:", error);
      alert("Erro ao carregar dados do servidor.");
    }
  }

  // Inicializa DataTable
  if (window.jQuery && window.$ && window.$.fn.dataTable) {
    const tabela = window.$("#conveniosTable").DataTable({
      colReorder: true,
      paging: true,
      searching: true,
      info: true,
      language: {
        emptyTable: "Nenhum convênio encontrado",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado",
        search: "Pesquisar:",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 a 0 de 0 registros",
        infoFiltered: "(filtrado de _MAX_ registros no total)",
        paginate: {
          first: "Primeiro",
          last: "Último",
          next: "Próximo",
          previous: "Anterior"
        }
      },
      createdRow: (row, data, dataIndex) => {
        window
          .$(row)
          .find("td")
          .each(function (index) {
            const labels = ["NOME DO CONVÊNIO", "CONSULTA", "DURAÇÃO", "VALOR", "PAGAMENTO (DIAS)", "AÇÕES"];
            window.$(this).attr("data-label", labels[index]);
          });
      },
    });

    // Carrega convênios ao inicializar
    carregarConvenios();
  } else {
    console.warn("jQuery ou DataTables não carregados corretamente.");
  }

  // Edit convênio function
  window.editConvenio = async (id, icon) => {
    try {
      const response = await fetch(`/api/convenios`);
      const convenios = await response.json();
      const convenio = convenios.find(c => c.id === id);

      if (convenio) {
        document.getElementById("nomeConvenio").value = convenio.nome_convenio.toUpperCase(); // Garantir maiúsculas
        document.getElementById("consulta").value = convenio.consulta;
        document.getElementById("duracao").value = convenio.duracao;
        document.getElementById("valor").value = `R$ ${parseFloat(convenio.valor).toFixed(2).replace('.', ',')}`;
        document.getElementById("pagamento").value = convenio.pagamento;

        modal.classList.add("active");
        document.body.style.overflow = "hidden";

        // Alterar comportamento do formulário para edição
        formConvenio.onsubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData(formConvenio);
          const dados = Object.fromEntries(formData);

          try {
            const response = await fetch(`/api/convenios/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nomeConvenio: dados.nomeConvenio.toUpperCase(), // Garantir maiúsculas
                consulta: dados.consulta,
                duracao: dados.duracao,
                valor: dados.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim(),
                pagamento: parseInt(dados.pagamento, 10)
              })
            });

            const result = await response.json();
            if (result.success) {
              alert(result.message);
              carregarConvenios();
              fecharModal();
            } else {
              alert("Erro: " + result.error);
            }
          } catch (error) {
            console.error("Erro ao editar convênio:", error);
            alert("Erro ao conectar com o servidor.");
          }
        };
      }
    } catch (error) {
      console.error("Erro ao carregar dados do convênio:", error);
      alert("Erro ao carregar dados do convênio.");
    }
  };
});