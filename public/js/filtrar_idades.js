document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.querySelector(".menu-icon");
  const userToggle = document.getElementById("userToggle");
  const userMenu = document.getElementById("userMenu");

  // Função para aplicar o estado inicial da sidebar com base no tamanho da tela
  function initializeSidebarState() {
    if (window.innerWidth >= 768) {
      // Em desktop, a sidebar começa colapsada
      sidebar.classList.add('collapsed');
      sidebar.classList.remove('active'); // Garante que a classe 'active' não esteja presente
      document.body.classList.remove("no-scroll"); // Garante que o scroll não esteja bloqueado
    } else {
      // Em mobile, a sidebar SEMPRE começa oculta (sem a classe 'active' e sem 'collapsed')
      sidebar.classList.remove('collapsed');
      sidebar.classList.remove('active'); // ESSENCIAL: Garante que 'active' seja removida ao carregar em mobile
      document.body.classList.remove("no-scroll"); // Garante que o scroll não esteja bloqueado
    }
  }

  // Chame a função ao carregar a página para definir o estado inicial correto
  initializeSidebarState();

  // Toggle sidebar (collapsed for desktop, active for mobile)
  menuIcon.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      sidebar.classList.toggle("active");
      document.body.classList.toggle("no-scroll"); // Impede scroll quando sidebar ativa
    } else {
      sidebar.classList.toggle("collapsed");
      sidebar.classList.remove('active'); // Garante que a classe 'active' não esteja presente em desktop
      document.body.classList.remove("no-scroll"); // Garante que o scroll não esteja bloqueado em desktop
    }
  });

  // Fecha a sidebar ao clicar em um item da lista em dispositivos móveis
  sidebar.querySelectorAll('nav ul li a').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 768 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        document.body.classList.remove("no-scroll");
      }
    });
  });

  // Fecha a sidebar ao clicar fora dela em dispositivos móveis
  document.addEventListener('click', function(e) {
    // Verifica se o clique não foi na sidebar e nem no ícone do menu
    if (window.innerWidth < 768 && sidebar.classList.contains('active') && !sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
      sidebar.classList.remove('active');
      document.body.classList.remove("no-scroll");
    }
  });

  // Gerencia a sidebar ao redimensionar a janela
  window.addEventListener('resize', () => {
    initializeSidebarState(); // Reaplica o estado correto ao redimensionar
  });

  // User dropdown
  userToggle.addEventListener("click", function(e) {
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex";
  });

  // Fecha dropdown ao clicar fora
  document.addEventListener("click", function(e) {
    if (!userMenu.contains(e.target) && e.target !== userToggle) {
      userMenu.style.display = "none";
    }
  });

  // Logout function
  window.logout = function() {
    alert("Você saiu com sucesso!");
    // window.location.href = "login.html";
  };

  // Filter ages function
  window.filterAges = function() {
    const minAge = parseInt(document.getElementById("minAge").value) || 0;
    const maxAge = parseInt(document.getElementById("maxAge").value) || 100;

    const allRows = [
      { name: "Túlio Siqueira", age: 13, status: "Ativo" },
      { name: "Adriana Farrel", age: 43, status: "Inativo" },
      { name: "Alice Alves de", age: 6, status: "Ativo" }
    ];

    const filteredRows = allRows.filter(row => row.age >= minAge && row.age <= maxAge);

    var table = $('#ageFilterTable').DataTable();
    table.clear();
    filteredRows.forEach(row => {
      table.row.add([
        row.name,
        `${row.age} anos, 0 meses`,
        row.status
      ]).draw(false);
    });
  };
});

// Inicializa DataTable com suporte a colunas arrastáveis
document.addEventListener('DOMContentLoaded', function () {
  if (window.jQuery && $.fn.dataTable) {
    $('#ageFilterTable').DataTable({
      colReorder: true,
      paging: false,
      searching: false,
      info: false,
      language: {
        emptyTable: "Nenhum dado disponível",
        loadingRecords: "Carregando...",
        processing: "Processando...",
        zeroRecords: "Nenhum registro encontrado"
      }
    });
  } else {
    console.warn("jQuery ou DataTables não carregados corretamente.");
  }
});