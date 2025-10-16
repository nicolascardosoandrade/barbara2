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

  // === CONFIGURAÇÃO DO FULLCALENDAR ===
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: '2025-10-13',
    initialView: window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek',
    locale: 'pt-br',
    timeZone: 'America/Sao_Paulo',
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    allDaySlot: false,
    slotDuration: '00:30:00',
    slotLabelInterval: '00:30:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    height: 'auto',
    aspectRatio: window.innerWidth < 768 ? 1.2 : 1.8,
    events: [
      { title: 'LAYLA PEREIRA DA SILVA', start: '2025-10-14T15:00:00', className: 'green' },
      { title: 'ALMOÇO', start: '2025-10-14T16:00:00', className: 'blue' },
      { title: 'LUANA SILVA OLIVEIRA MÃE', start: '2025-10-14T17:00:00', className: 'green' },
      { title: 'LETICIA DIAS PLATINIR', start: '2025-10-14T18:00:00', className: 'green' },
      { title: 'MARIA JULIA DIVINO AVELAR', start: '2025-10-14T19:00:00', className: 'green' },
      { title: 'SOPHIA MEIRA DE PAULA MÃE', start: '2025-10-14T20:00:00', className: 'green' },
      { title: 'ANA LUIZA MENDES DE', start: '2025-10-14T21:00:00', className: 'green' },
      { title: 'CAROLINE MARTINS DE', start: '2025-10-14T22:00:00', className: 'green' },
      { title: 'CLARA SOUTO CHAVES DE', start: '2025-10-14T23:00:00', className: 'green' },
      { title: 'MÃE CAMILA', start: '2025-10-15T15:00:00', className: 'red' },
      { title: 'CRISTINA', start: '2025-10-15T16:00:00', className: 'green' },
      { title: 'ALMOÇO', start: '2025-10-15T17:00:00', className: 'blue' },
      { title: 'WAILANE DE SOUZA GOMES', start: '2025-10-15T18:00:00', className: 'green' },
      { title: 'MELISSA COELHO MARQUES', start: '2025-10-15T19:00:00', className: 'green' },
      { title: 'MÃE LARISSA', start: '2025-10-15T20:00:00', className: 'green' },
      { title: 'MELISSA COELHO MARQUES', start: '2025-10-15T21:00:00', className: 'green' },
      { title: 'MÃE LARISSA', start: '2025-10-15T22:00:00', className: 'green' },
      { title: 'KENYA CRISTINI FERREIRA RIBE', start: '2025-10-15T23:00:00', className: 'red' },
      { title: 'DIENIFER KEIT DA SILVA MAGALHÃES', start: '2025-10-16T15:00:00', className: 'green' },
      { title: 'ALMOÇO', start: '2025-10-16T16:00:00', className: 'blue' },
      { title: 'JULIA CRISTINA CARVALHO', start: '2025-10-16T17:00:00', className: 'green' },
      { title: 'STEFANY SARA OLIVEIRA', start: '2025-10-16T18:00:00', className: 'green' },
      { title: 'JOSE ELIAS RIBEIRO', start: '2025-10-16T19:00:00', className: 'green' },
      { title: 'ELTON MARCOS ANSELMO MÃE', start: '2025-10-16T20:00:00', className: 'green' },
      { title: 'SOPHIA MEIRA DE PAULA MÃE', start: '2025-10-16T21:00:00', className: 'green' },
      { title: 'VALENTINA DAMASCENO', start: '2025-10-16T22:00:00', className: 'green' },
      { title: 'DEBORA DUARTE DE PAULA', start: '2025-10-16T23:00:00', className: 'red' },
      { title: 'NATHAN ROGERIO SILVA', start: '2025-10-17T15:00:00', className: 'green' },
      { title: 'ALMOÇO', start: '2025-10-17T16:00:00', className: 'blue' },
      { title: 'VINIUS AUGUSTO ALMEIDA', start: '2025-10-17T17:00:00', className: 'green' },
      { title: 'JULIA CARVALHO SANTOS MÃE', start: '2025-10-17T18:00:00', className: 'green' },
      { title: 'ELTON MARCOS ANSELMO MÃE', start: '2025-10-17T19:00:00', className: 'green' },
      { title: 'CIERO JOSE DA SILVA', start: '2025-10-17T20:00:00', className: 'green' },
      { title: 'MELISA RODRIGODES DIAS MÃE', start: '2025-10-17T21:00:00', className: 'green' },
      { title: 'PRISCILA BATISTA RODRIGODES', start: '2025-10-17T22:00:00', className: 'green' },
      { title: 'CLARA SOUTO CHAVES DE', start: '2025-10-17T23:00:00', className: 'green' },
      { title: 'LUIZ HENRIQUE DE OLIVEIRA', start: '2025-10-18T15:00:00', className: 'green' },
      { title: 'ALMOÇO', start: '2025-10-18T16:00:00', className: 'blue' },
      { title: 'TULIO SIQUEIRA DE OLIVEIRA', start: '2025-10-18T17:00:00', className: 'green' },
      { title: 'THALLY HENRIQUE ASSIS MÃE', start: '2025-10-18T18:00:00', className: 'green' },
      { title: 'CIERO JOSE DA SILVA', start: '2025-10-18T19:00:00', className: 'green' },
      { title: 'ROSA DABIEN', start: '2025-10-18T20:00:00', className: 'green' },
      { title: 'CRISTAL FERREIRA DA SILVA', start: '2025-10-18T21:00:00', className: 'green' },
      { title: 'GEORGISON OLIVEIRA BASTOS', start: '2025-10-18T22:00:00', className: 'green' },
      { title: 'THALISSON AVELINO PERES', start: '2025-10-18T23:00:00', className: 'green' },
      { title: 'ALMOÇO', start: '2025-10-19T15:00:00', className: 'blue' }
    ],
    eventDidMount: function(info) {
      if (info.event.classNames.includes('green')) {
        info.el.style.backgroundColor = 'green';
      } else if (info.event.classNames.includes('red')) {
        info.el.style.backgroundColor = 'red';
      } else if (info.event.classNames.includes('blue')) {
        info.el.style.backgroundColor = '#0366d6';
      }
    },
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    }
  });

  calendar.render();

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
    setTimeout(() => {
      calendar.updateSize();
    }, 310);
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
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    if (isMobile && calendar.view.type !== 'timeGridDay') {
      calendar.changeView('timeGridDay');
      document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.view-btn[data-view="timeGridDay"]').classList.add('active');
    } else if (!isMobile && calendar.view.type !== 'timeGridWeek' && calendar.view.type !== 'dayGridMonth') {
      calendar.changeView('timeGridWeek');
      document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.view-btn[data-view="timeGridWeek"]').classList.add('active');
    }
    // Ajusta aspectRatio dinamicamente
    calendar.setOption('aspectRatio', isSmallMobile ? 1.0 : isMobile ? 1.2 : 1.8);
    setTimeout(() => {
      calendar.updateSize();
    }, 310);
  });

  // === MUDANÇA DE VISUALIZAÇÃO (DIA, SEMANA, MÊS) ===
  document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', () => {
      const view = button.getAttribute('data-view');
      const isMobile = window.innerWidth < 768;
      if (isMobile && view === 'timeGridWeek') {
        // Em mobile, permite semana mas ajusta
        calendar.setOption('aspectRatio', 1.2);
      } else if (view === 'timeGridDay') {
        calendar.setOption('aspectRatio', 1.2);
      } else {
        calendar.setOption('aspectRatio', 1.8);
      }
      calendar.changeView(view);
      document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      setTimeout(() => {
        calendar.updateSize();
      }, 100);
    });
  });

  // Adiciona a classe 'active' ao botão de visualização inicial
  if (window.innerWidth < 768) {
    document.querySelector('.view-btn[data-view="timeGridDay"]').classList.add('active');
  } else {
    document.querySelector('.view-btn[data-view="timeGridWeek"]').classList.add('active');
  }

  // === BOTÃO HOJE ===
  const todayBtn = document.getElementById('todayBtn');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      calendar.today();
    });
  }

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

  // Função para logout
  window.logout = function() {
    alert("Você saiu com sucesso!");
    // window.location.href = "login.html";
  };
});