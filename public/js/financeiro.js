document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.querySelector(".menu-icon");
  const userToggle = document.getElementById("userToggle");
  const userMenu = document.getElementById("userMenu");
  const editBtn = document.getElementById("edit-btn");
  const clinicaSpan = document.getElementById("clinica-percent");
  const impostoSpan = document.getElementById("imposto-percent");
  let isEditing = false;

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

  // Edit button functionality
  editBtn.addEventListener('click', function() {
    if (!isEditing) {
      // Iniciar modo de edição
      const currentClinica = parseFloat(clinicaSpan.textContent.replace('%', '').trim());
      const currentImposto = parseFloat(impostoSpan.textContent.replace('%', '').trim());

      // Criar input para clínica
      const clinicaInput = document.createElement('input');
      clinicaInput.type = 'number';
      clinicaInput.min = 0;
      clinicaInput.max = 100;
      clinicaInput.step = 1;
      clinicaInput.value = currentClinica;
      clinicaInput.className = 'percent-input';

      const percentClinicaText = document.createTextNode('%');

      const clinicaItem = document.getElementById('clinica-item');
      const oldClinicaSpan = document.getElementById('clinica-percent');
      clinicaItem.removeChild(oldClinicaSpan);
      clinicaItem.appendChild(clinicaInput);
      clinicaItem.appendChild(percentClinicaText);

      // Criar input para impostos
      const impostoInput = document.createElement('input');
      impostoInput.type = 'number';
      impostoInput.min = 0;
      impostoInput.max = 100;
      impostoInput.step = 1;
      impostoInput.value = currentImposto;
      impostoInput.className = 'percent-input';

      const percentImpostoText = document.createTextNode('%');

      const impostoItem = document.getElementById('imposto-item');
      const oldImpostoSpan = document.getElementById('imposto-percent');
      impostoItem.removeChild(oldImpostoSpan);
      impostoItem.appendChild(impostoInput);
      impostoItem.appendChild(percentImpostoText);

      // Alterar botão para "Salvar"
      editBtn.textContent = 'Salvar';
      editBtn.classList.remove('edit-btn');
      editBtn.classList.add('save-btn');

      isEditing = true;
    } else {
      // Salvar alterações
      const clinicaInput = document.querySelector('#clinica-item input');
      const impostoInput = document.querySelector('#imposto-item input');

      const newClinica = parseFloat(clinicaInput.value);
      const newImposto = parseFloat(impostoInput.value);

      // Recriar spans
      const newClinicaSpan = document.createElement('span');
      newClinicaSpan.id = 'clinica-percent';
      newClinicaSpan.textContent = `% ${newClinica}`;

      const newImpostoSpan = document.createElement('span');
      newImpostoSpan.id = 'imposto-percent';
      newImpostoSpan.textContent = `% ${newImposto}`;

      // Substituir no DOM
      const clinicaItem = document.getElementById('clinica-item');
      const percentClinicaText = clinicaItem.lastChild; // O text node '%'
      clinicaItem.removeChild(clinicaInput);
      clinicaItem.removeChild(percentClinicaText);
      clinicaItem.appendChild(newClinicaSpan);

      const impostoItem = document.getElementById('imposto-item');
      const percentImpostoText = impostoItem.lastChild; // O text node '%'
      impostoItem.removeChild(impostoInput);
      impostoItem.removeChild(percentImpostoText);
      impostoItem.appendChild(newImpostoSpan);

      // Alterar botão de volta para "Editar"
      editBtn.textContent = 'Editar';
      editBtn.classList.remove('save-btn');
      editBtn.classList.add('edit-btn');

      isEditing = false;

      alert('Porcentagens atualizadas com sucesso!');
    }
  });
});

// Inicializa DataTable com suporte a colunas arrastáveis
document.addEventListener('DOMContentLoaded', function () {
  if (window.jQuery && $.fn.dataTable) {
    $('#relatorio-financeiro').DataTable({
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