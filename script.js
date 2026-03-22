/**
 * PORTFÓLIO PESSOAL — script.js
 *
 * Funcionalidades implementadas:
 * 1. Menu hambúrguer (mobile)
 * 2. Tema claro / escuro (com persistência em localStorage)
 * 3. Link ativo na navbar conforme seção visível (IntersectionObserver)
 * 4. Animação de entrada das seções ao rolar (IntersectionObserver)
 * 5. Animação das barras de habilidades ao entrar na viewport
 * 6. Validação do formulário de contato
 * 7. Simulação de envio e exibição do modal de confirmação
 */


/* ==========================================================================
   1. MENU HAMBÚRGUER — mobile
========================================================================== */

/**
 * Alterna a exibição do menu mobile.
 * Chamado pelo onclick do botão hambúrguer no HTML.
 */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

/**
 * Fecha o menu mobile.
 * Chamado quando o usuário clica em qualquer link do menu mobile.
 */
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}


/* ==========================================================================
   2. TEMA CLARO / ESCURO
========================================================================== */

/**
 * Alterna entre tema claro e escuro.
 * Adiciona/remove a classe 'dark' no <body> e salva a preferência
 * no localStorage para manter na próxima visita.
 */
function toggleTheme() {
  const body  = document.body;
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  const isDark = body.classList.toggle('dark');

  // Atualiza ícone e texto do botão
  icon.textContent  = isDark ? '☀️' : '🌙';
  label.textContent = isDark ? 'Claro' : 'Escuro';

  // Persiste preferência no navegador
  localStorage.setItem('tema', isDark ? 'dark' : 'light');
}

/**
 * Aplica o tema salvo pelo usuário ao carregar a página.
 * Executado imediatamente (IIFE) para evitar "flash" de tema errado.
 */
(function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('themeIcon').textContent  = '☀️';
    document.getElementById('themeLabel').textContent = 'Claro';
  }
})();


/* ==========================================================================
   3. LINK ATIVO NA NAVBAR (IntersectionObserver)
========================================================================== */

/**
 * Observa todas as seções e marca o link correspondente como 'active'
 * na navbar conforme a seção aparece no centro da viewport.
 */
const sections  = document.querySelectorAll('section[id]');
const navLinksA = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove 'active' de todos os links
        navLinksA.forEach((a) => a.classList.remove('active'));
        // Adiciona 'active' ao link que corresponde à seção visível
        const linkAtivo = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (linkAtivo) linkAtivo.classList.add('active');
      }
    });
  },
  { threshold: 0.4 } // seção precisa ocupar 40% da viewport para ativar
);

sections.forEach((secao) => observerNav.observe(secao));


/* ==========================================================================
   4. ANIMAÇÃO DE ENTRADA DAS SEÇÕES (IntersectionObserver)
========================================================================== */

/**
 * Adiciona a classe 'visible' nos elementos com classe 'reveal'
 * quando entram na viewport, disparando a transição CSS definida em style.css.
 */
const revealEls = document.querySelectorAll('.reveal');

const observerReveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target); // anima apenas uma vez
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observerReveal.observe(el));


/* ==========================================================================
   5. ANIMAÇÃO DAS BARRAS DE HABILIDADES (IntersectionObserver)
========================================================================== */

/**
 * Cada barra possui um atributo data-width com o valor percentual alvo.
 * Quando a barra entra na viewport, a largura é aplicada via CSS transition.
 */
const skillBars = document.querySelectorAll('.skill-fill');

const observerSkills = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const larguraAlvo = entry.target.getAttribute('data-width');
        entry.target.style.width = larguraAlvo + '%';
        observerSkills.unobserve(entry.target); // anima apenas uma vez
      }
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach((barra) => observerSkills.observe(barra));


/* ==========================================================================
   6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
========================================================================== */

/**
 * Realiza a validação dos campos ao submeter o formulário.
 * Regras:
 *   - Nome: não pode ser vazio
 *   - E-mail: precisa ter formato usuario@dominio.com
 *   - Mensagem: não pode ser vazia
 *
 * Em caso de erro:
 *   - Adiciona a classe 'invalid' no campo
 *   - Exibe a mensagem de erro correspondente
 *
 * Em caso de sucesso:
 *   - Limpa os campos
 *   - Exibe o modal de confirmação
 */
document.getElementById('contatoForm').addEventListener('submit', function (e) {
  e.preventDefault(); // impede o envio padrão do formulário

  /* --- Referências dos campos --- */
  const campoNome     = document.getElementById('nome');
  const campoEmail    = document.getElementById('email');
  const campoMensagem = document.getElementById('mensagem');

  /* --- Referências das mensagens de erro --- */
  const erroNome     = document.getElementById('erroNome');
  const erroEmail    = document.getElementById('erroEmail');
  const erroMensagem = document.getElementById('erroMensagem');

  let formularioValido = true;

  /* --- Limpa estados anteriores de erro --- */
  [campoNome, campoEmail, campoMensagem].forEach(function (campo) {
    campo.classList.remove('invalid');
  });
  [erroNome, erroEmail, erroMensagem].forEach(function (msg) {
    msg.classList.remove('visible');
  });

  /* --- Validação: Nome --- */
  if (campoNome.value.trim() === '') {
    campoNome.classList.add('invalid');
    erroNome.classList.add('visible');
    formularioValido = false;
  }

  /* --- Validação: E-mail (formato usuario@dominio.com) --- */
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(campoEmail.value.trim())) {
    campoEmail.classList.add('invalid');
    erroEmail.classList.add('visible');
    formularioValido = false;
  }

  /* --- Validação: Mensagem --- */
  if (campoMensagem.value.trim() === '') {
    campoMensagem.classList.add('invalid');
    erroMensagem.classList.add('visible');
    formularioValido = false;
  }

  /* --- Sucesso: simula envio --- */
  if (formularioValido) {
    // Limpa todos os campos do formulário
    campoNome.value     = '';
    campoEmail.value    = '';
    campoMensagem.value = '';

    // Abre o modal de confirmação
    abrirModal();
  }
});


/* ==========================================================================
   7. MODAL DE CONFIRMAÇÃO
========================================================================== */

/**
 * Abre o modal de sucesso após envio do formulário.
 */
function abrirModal() {
  document.getElementById('modalOverlay').classList.add('open');
}

/**
 * Fecha o modal de confirmação.
 * Chamado pelo botão "Fechar" dentro do modal (onclick no HTML).
 */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

/**
 * Fecha o modal ao clicar fora da caixa (no overlay escurecido).
 */
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});
