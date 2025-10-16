document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.querySelector(".menu-icon");
  const userToggle = document.getElementById("userToggle");
  const userMenu = document.getElementById("userMenu");

  // Função para aplicar o estado inicial da sidebar com base no tamanho da tela
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

  // === Modal e Formulário ===
  const btnAdicionar = document.getElementById("btnAdicionar");
  const modal = document.getElementById("modalPaciente");
  const closeModal = document.getElementById("closeModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const formPaciente = document.getElementById("formPaciente");
  const nomeCompletoInput = document.getElementById("nomeCompleto");
  const responsavelInput = document.getElementById("responsavel");
  const cepInput = document.getElementById("cep");
  const numeroInput = document.getElementById("numero");
  const convenioSelect = document.getElementById("convenio");

  // Função para carregar convênios do banco
  async function carregarConvenios() {
    try {
      const response = await fetch('/api/convenios');
      const convenios = await response.json();

      // Limpa o select, mantendo apenas a opção padrão
      convenioSelect.innerHTML = '<option value="">Selecione</option>';

      // Adiciona os convênios do banco ao select
      convenios.forEach(convenio => {
        const option = document.createElement('option');
        option.value = convenio.nome_convenio;
        option.textContent = convenio.nome_convenio;
        convenioSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar convênios:', error);
      alert('Erro ao carregar lista de convênios.');
    }
  }

  btnAdicionar.addEventListener("click", () => {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    formPaciente.reset();
    carregarConvenios(); // Carrega os convênios ao abrir o modal
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
    formPaciente.reset();
  });

  btnCancelar.addEventListener("click", () => {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
    formPaciente.reset();
  });

  // Forçar letras maiúsculas nos campos nomeCompleto e responsavel
  nomeCompletoInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  responsavelInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  // Forçar apenas números no campo CEP com máscara
  cepInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    }

    e.target.value = value;

    if (value.replace(/\D/g, "").length === 8) {
      buscarEnderecoPorCep(value.replace(/\D/g, ""));
    }
  });

  // Forçar apenas números no campo Número
  numeroInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = value;
  });

  // Função para calcular idade
  function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    const dia = hoje.getDate() - nascimento.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
      idade--;
    }

    const anos = idade;
    const meses = mes < 0 ? mes + 12 : mes;
    const dias = dia < 0 ? dia + new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate() : dia;

    return `${anos} anos, ${meses} meses, ${dias} dias`;
  }

  // Submissão do formulário
  formPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formPaciente);
    const dados = Object.fromEntries(formData);

    // Preserva o formato com hífen para o endereço completo
    const enderecoCompleto = `${dados.logradouro} ${dados.numero}-${dados.cep}`;

    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCompleto: dados.nomeCompleto.toUpperCase(),
          responsavel: dados.responsavel ? dados.responsavel.toUpperCase() : null,
          telefone: dados.telefone,
          email: dados.email,
          dataNascimento: dados.dataNascimento,
          cpf: dados.cpf,
          convenio: dados.convenio,
          cep: dados.cep, // Envia o CEP formatado com hífen
          logradouro: dados.logradouro,
          numero: dados.numero,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);

        // Atualiza a tabela com o novo paciente
        const tabela = $("#relatorio-pacientes").DataTable();
        tabela.row.add([
          dados.nomeCompleto.toUpperCase(),
          calcularIdade(dados.dataNascimento),
          dados.cpf,
          dados.convenio,
          'Ativo',
          '<span class="material-icons">description</span>'
        ]).draw();

        modal.classList.remove("show");
        document.body.style.overflow = "auto";
        formPaciente.reset();
      } else {
        alert("Erro: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });

  // Máscara para CPF
  const cpfInput = document.getElementById("cpf");
  cpfInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    e.target.value = value;
  });

  // Máscara para telefone
  const telefoneInput = document.getElementById("telefone");
  telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }

    e.target.value = value;
  });

  async function buscarEnderecoPorCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        document.getElementById("logradouro").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("estado").value = data.uf || "";
      } else {
        alert("CEP não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  }

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
        const tabela = window.$("#relatorio-pacientes").DataTable();
        tabela.search(this.value).draw();
      }
    });
  }

  // Inicializa DataTable
  if (window.jQuery && window.$ && window.$.fn.dataTable) {
    const tabela = window.$("#relatorio-pacientes").DataTable({
      colReorder: true,
      paging: false,
      searching: true,
      info: false,
      language: {
        emptyTable: "Nenhum paciente encontrado",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado",
      },
      createdRow: (row, data, dataIndex) => {
        window
          .$(row)
          .find("td")
          .each(function (index) {
            const labels = ["PACIENTE", "IDADE", "CPF", "CONVÊNIO", "SITUAÇÃO", "EXTRATO DOS AGENDAMENTOS"];
            window.$(this).attr("data-label", labels[index]);
          });
      },
    });
  } else {
    console.warn("jQuery ou DataTables não carregados corretamente.");
  }

  // Carrega pacientes do banco
  async function carregarPacientes() {
    try {
      const response = await fetch('/api/pacientes');
      const pacientes = await response.json();

      const tabela = $("#relatorio-pacientes").DataTable();
      tabela.clear();

      pacientes.forEach(p => {
        tabela.row.add([
          p.nome_completo.toUpperCase(),
          calcularIdade(p.data_nascimento),
          p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
          p.convenio,
          p.situacao,
          '<span class="material-icons">description</span>'
        ]);
      });

      tabela.draw();
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  }

  carregarPacientes();
});