/* ============================================
   RÉGLICRED — JavaScript Vanilla ES6
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  try {

  // ===== LOADING SCREEN =====
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('loaded');
    }, 1800);
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let navbarRafPending = false;

  window.addEventListener('scroll', () => {
    if (navbarRafPending) return;
    navbarRafPending = true;
    
    requestAnimationFrame(() => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
      navbarRafPending = false;
    });
  }, { passive: true });

  // ===== MOBILE DRAWER =====
  const navToggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta, #drawer-logo-link');

  function openDrawer() {
    if (drawer && drawerOverlay) {
      drawer.classList.add('active');
      drawerOverlay.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
      if (navToggle) navToggle.classList.add('active');
    }
  }

  function closeDrawer() {
    if (drawer && drawerOverlay) {
      drawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
      if (navToggle) navToggle.classList.remove('active');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Close drawer on link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // navbar height
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== PHONE MASK =====
  function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 7) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
      
      e.target.value = value;
    });
  }

  document.querySelectorAll('input[type="tel"]').forEach(input => {
    applyPhoneMask(input);
  });

  // ===== FORM VALIDATION =====
  function validateForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nome = form.querySelector('input[name="nome"]');
      const email = form.querySelector('input[name="email"]');
      const telefone = form.querySelector('input[name="telefone"]');
      const operacao = form.querySelector('select[name="operacao"]');
      const mensagem = form.querySelector('textarea[name="mensagem"]');
      
      let valid = true;
      
      // Validate name
      if (!nome.value.trim() || nome.value.trim().length < 3) {
        nome.style.borderColor = '#c0392b';
        valid = false;
      } else {
        nome.style.borderColor = '';
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        email.style.borderColor = '#c0392b';
        valid = false;
      } else {
        email.style.borderColor = '';
      }
      
      // Validate phone
      const phoneDigits = telefone.value.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        telefone.style.borderColor = '#c0392b';
        valid = false;
      } else {
        telefone.style.borderColor = '';
      }
      
      // Validate operation
      if (!operacao.value) {
        operacao.style.borderColor = '#c0392b';
        valid = false;
      } else {
        operacao.style.borderColor = '';
      }
      
      if (valid) {
        // Build WhatsApp message with structured list (Skill AG5 format)
        const tipoOperacao = operacao.options[operacao.selectedIndex].text;
        const mensagemExtra = mensagem && mensagem.value.trim() ? mensagem.value.trim() : '';

        let whatsappText = `Olá, me chamo ${nome.value.trim()}, vim através do site e gostaria de uma informação.

- E-mail: ${email.value.trim()}
- Telefone: ${telefone.value}
- Operação: ${tipoOperacao}`;
        if (mensagemExtra) whatsappText += `\n- Mensagem: ${mensagemExtra}`;

        const whatsappUrl = `https://wa.me/5521980092063?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, '_blank');
      }
    });
  }

  const heroForm = document.getElementById('hero-form');
  const ctaForm = document.getElementById('cta-form');
  
  if (heroForm) validateForm(heroForm);
  if (ctaForm) validateForm(ctaForm);

  // ===== INTERSECTION OBSERVER — REVEAL =====
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 1800;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          
          counter.textContent = current;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-number').forEach(counter => {
    counterObserver.observe(counter);
  });

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===== DEPOIMENTOS DATA & MARQUEE =====
  const depoimentos = [
    {
      nome: "Aluizio Teles",
      tempo: "há 3 meses",
      texto: "Ótimo, excelente!! Não tenho palavras para agradecer a Ane Santana. Tive um problema em concluir o empréstimo e ela foi incansável."
    },
    {
      nome: "ROOSEVELT DE SOUZA",
      tempo: "há 3 meses",
      texto: "Atendimento excepcional feito pela atendente Ane, que me auxiliou em todas as minhas dúvidas, com total atenção e excelência."
    },
    {
      nome: "Daniel Almeida",
      tempo: "há 6 meses",
      texto: "Fui atendido pela Sra. Ane de forma excelente. Resolveu meu problema com agilidade, atenção, proatividade e profissionalismo."
    },
    {
      nome: "Robsom Moraes",
      tempo: "há 9 meses",
      texto: "Muito bom atendimento, de muita qualidade, e super simpática a atendente Luana."
    },
    {
      nome: "Gee Tjf",
      tempo: "há 7 meses",
      texto: "Atendente Ane, tratamento atenciosamente agradável e bem esclarecido. Tem todo meu respeito e admiração!!!"
    },
    {
      nome: "Luiz Carlos Gonçalves",
      tempo: "há 5 meses",
      texto: "A Ane me atendeu muito bem, excelente atendimento, recomendo demais."
    },
    {
      nome: "Leandro Braga",
      tempo: "há 8 meses",
      texto: "Excelente atendimento com a funcionária Ane, superou minhas expectativas."
    },
    {
      nome: "Paulo Lima",
      tempo: "há 7 meses",
      texto: "Perfeito atendimento. Ane é uma ótima pessoa e profissional, me ajudou super!!!!"
    },
    {
      nome: "Alessandra Moura",
      tempo: "há 9 meses",
      texto: "Foi excelente. Amei o atendimento e o profissionalismo. Foi rápido e muito prático. Pessoas educadas e eficientes."
    },
    {
      nome: "Katia Sodré",
      tempo: "há 9 meses",
      texto: "Fui atendida pela Luana, que prestou um serviço de excelência. Não deixou nem um minuto de me responder."
    },
    {
      nome: "Marcia Teixeira",
      tempo: "há 3 meses",
      texto: "Fui muito bem atendida, tratamento top."
    },
    {
      nome: "Edinho Oliveira",
      tempo: "há 4 meses",
      texto: "Excelente atendimento. A secretária Ane é ótima profissional."
    }
  ];

  const stackContainer = document.getElementById('depo-stack-container');
  const counterEl = document.getElementById('depo-stack-counter');
  const btnPrev = document.getElementById('btn-prev-depo');
  const btnNext = document.getElementById('btn-next-depo');
  
  function createDepoCard(depo) {
    const inicial = depo.nome.charAt(0).toUpperCase();
    return `
      <div class="depo-stack-card">
        <div class="depo-card-header">
          <div class="depo-user">
            <div class="depo-avatar">${inicial}</div>
            <div class="depo-meta">
              <span class="depo-author">${depo.nome}</span>
              <span class="depo-verified">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="verified-icon"><polyline points="20 6 9 17 4 12"/></svg>
                Cliente Verificado
              </span>
            </div>
          </div>
          <span class="depo-time">${depo.tempo}</span>
        </div>
        <div class="depo-stars">★★★★★</div>
        <p class="depo-text">"${depo.texto}"</p>
      </div>
    `;
  }

  if (stackContainer) {
    stackContainer.innerHTML = depoimentos.map(createDepoCard).join('');
    const cards = stackContainer.querySelectorAll('.depo-stack-card');
    let currentIndex = 0;
    let isAnimating = false;
    
    function updateStack() {
      cards.forEach((card, index) => {
        card.classList.remove('active', 'next', 'prev-stack', 'hidden-stack');
        
        // Calcula a posição relativa da carta na pilha de forma circular
        const pos = (index - currentIndex + cards.length) % cards.length;
        
        if (pos === 0) {
          card.classList.add('active');
          card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
          card.style.opacity = '1';
          card.style.zIndex = '3';
          card.style.pointerEvents = 'auto';
          card.style.visibility = 'visible';
        } else if (pos === 1) {
          card.classList.add('next');
          card.style.transform = 'translate3d(0, 16px, 0) scale(0.95) rotate(-1.5deg)';
          card.style.opacity = '0.85';
          card.style.zIndex = '2';
          card.style.pointerEvents = 'none';
          card.style.visibility = 'visible';
        } else if (pos === 2) {
          card.classList.add('prev-stack'); // Terceiro card na profundidade da pilha
          card.style.transform = 'translate3d(0, 32px, 0) scale(0.90) rotate(1.5deg)';
          card.style.opacity = '0.45';
          card.style.zIndex = '1';
          card.style.pointerEvents = 'none';
          card.style.visibility = 'visible';
        } else {
          card.classList.add('hidden-stack');
          card.style.transform = 'translate3d(0, 32px, 0) scale(0.90) rotate(1.5deg)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
          card.style.visibility = 'hidden';
        }
      });
      
      // Atualizar contador textual
      if (counterEl) {
        const activeNum = (currentIndex + 1).toString().padStart(2, '0');
        const totalNum = cards.length.toString().padStart(2, '0');
        counterEl.innerText = `${activeNum} / ${totalNum}`;
      }
    }

    function goToNextCard() {
      if (isAnimating) return;
      isAnimating = true;
      
      const activeCard = cards[currentIndex];
      activeCard.classList.add('swipe-out');
      activeCard.style.transform = 'translate3d(120%, -30px, 0) scale(0.95) rotate(12deg)';
      activeCard.style.opacity = '0';
      
      currentIndex = (currentIndex + 1) % cards.length;
      
      setTimeout(() => {
        updateStack();
      }, 80);
      
      setTimeout(() => {
        activeCard.classList.remove('swipe-out');
        isAnimating = false;
      }, 450);
    }

    let autoplayInterval = null;
    const autoplayDelay = 12000; // 12 segundos para leitura confortável

    function startAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        if (!isDragging && !isAnimating) {
          goToNextCard();
        }
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    function resetAutoplay() {
      startAutoplay();
    }

    // Inicializar visual da pilha e autoplay
    updateStack();
    startAutoplay();

    // Lógica premium de Swipe e Clique Físico no Card Ativo (Estilo Tinder/Stories)
    let startX = 0;
    let startY = 0;
    let dragDeltaX = 0;
    let dragDeltaY = 0;
    let isDragging = false;
    let activeDragCard = null;

    function handleDragStart(e) {
      if (isAnimating) return;
      
      // Apenas interage se for o card ativo
      const card = e.currentTarget;
      if (!card.classList.contains('active')) return;

      stopAutoplay();
      isDragging = true;
      activeDragCard = card;
      dragDeltaX = 0;
      dragDeltaY = 0;
      
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      
      card.style.transition = 'none';
      
      if (e.type.startsWith('touch')) {
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
      } else {
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
      }
    }

    function handleDragMove(e) {
      if (!isDragging || !activeDragCard) return;
      
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      
      dragDeltaX = clientX - startX;
      dragDeltaY = clientY - startY;
      
      // Prevenir comportamento padrão de rolagem de página ao arrastar no mobile
      if (e.type.startsWith('touch') && Math.abs(dragDeltaX) > Math.abs(dragDeltaY)) {
        if (e.cancelable) e.preventDefault();
      }
      
      // Rotação física sutil baseada no movimento
      const rotate = dragDeltaX * 0.04;
      activeDragCard.style.transform = `translate3d(${dragDeltaX}px, ${dragDeltaY}px, 0) scale(1) rotate(${rotate}deg)`;
      
      // Diminuir ligeiramente a opacidade conforme afasta do centro
      const percent = Math.min(Math.abs(dragDeltaX) / 200, 1);
      activeDragCard.style.opacity = (1 - percent * 0.25).toString();
    }

    function handleDragEnd(e) {
      if (!isDragging || !activeDragCard) return;
      isDragging = false;
      
      const card = activeDragCard;
      activeDragCard = null;
      
      card.style.transition = '';
      
      // Remover os listeners globais temporários
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      
      const swipeThreshold = 80; // limite de pixels para acionar o descarte
      
      if (Math.abs(dragDeltaX) > swipeThreshold) {
        // Descarte bem-sucedido (Swipe)
        isAnimating = true;
        const direction = dragDeltaX > 0 ? 1 : -1;
        
        card.classList.add('swipe-out');
        card.style.transform = `translate3d(${direction * 120}%, ${dragDeltaY}px, 0) scale(0.95) rotate(${direction * 12}deg)`;
        card.style.opacity = '0';
        
        currentIndex = (currentIndex + 1) % cards.length;
        
        setTimeout(() => {
          updateStack();
        }, 80);
        
        setTimeout(() => {
          card.classList.remove('swipe-out');
          isAnimating = false;
        }, 450);
      } else {
        // Restaurar o card para a posição inicial se não atingir o limite
        card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        card.style.opacity = '1';
        
        // Se a distância for muito pequena, interpretar como um clique comum
        if (Math.abs(dragDeltaX) < 6 && Math.abs(dragDeltaY) < 6) {
          // Evita clique se clicou em botões ou links internos do card
          if (e.target.closest('a') || e.target.closest('button')) return;
          
          isAnimating = true;
          card.classList.add('swipe-out');
          card.style.transform = 'translate3d(120%, -30px, 0) scale(0.95) rotate(12deg)';
          card.style.opacity = '0';
          
          currentIndex = (currentIndex + 1) % cards.length;
          
          setTimeout(() => {
            updateStack();
          }, 80);
          
          setTimeout(() => {
            card.classList.remove('swipe-out');
            isAnimating = false;
          }, 450);
        }
      }
      resetAutoplay();
    }

    // Associar os eventos de drag/toque a todos os cards
    cards.forEach((card) => {
      card.addEventListener('mousedown', handleDragStart);
      card.addEventListener('touchstart', handleDragStart, { passive: true });
    });

    // Eventos de clique nas setas de navegação
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        resetAutoplay();
        goToNextCard();
      });
    }
    
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (isAnimating) return;
        resetAutoplay();
        isAnimating = true;
        
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        const newActiveCard = cards[currentIndex];
        
        newActiveCard.style.transition = 'none';
        newActiveCard.style.transform = 'translate3d(-120%, -30px, 0) scale(0.95) rotate(-12deg)';
        newActiveCard.style.opacity = '0';
        newActiveCard.style.zIndex = '4';
        newActiveCard.style.visibility = 'visible';
        
        newActiveCard.offsetHeight; // Forçar o reflow
        
        newActiveCard.style.transition = '';
        updateStack();
        
        setTimeout(() => {
          isAnimating = false;
        }, 450);
      });
    }
  }

  // ===== NAVBAR LINK ACTIVE STATE =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let sectionPositions = [];
  let activeStateRafPending = false;

  function cacheSectionPositions() {
    sectionPositions = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop - 120
    }));
  }

  // Cache inicial das posições após o load da página e redimensionamento
  window.addEventListener('load', cacheSectionPositions);
  window.addEventListener('resize', cacheSectionPositions, { passive: true });

  window.addEventListener('scroll', () => {
    if (activeStateRafPending) return;
    activeStateRafPending = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      let current = '';

      for (let i = 0; i < sectionPositions.length; i++) {
        if (scrollY >= sectionPositions[i].top) {
          current = sectionPositions[i].id;
        }
      }

      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      activeStateRafPending = false;
    });
  }, { passive: true });

  // O hover do marquee foi removido na Opção A (Bento Grid estático)

  // ===== SCROLL TO TOP ON PAGE LOAD =====
  window.scrollTo(0, 0);

  // ===== WHATSAPP PREMIUM EXPERIENCE (AG5 V4) =====
  (function initWaPremium() {
    // Nicho financeiro/consignado = RIGOROSO → sem badge de notificação fabricada
    const MODO_COMPLIANCE = true;

    const bubble        = document.getElementById('wa-message-bubble');
    const typing        = document.getElementById('wa-typing');
    const realMessage   = document.getElementById('wa-real-message');
    const badge         = document.getElementById('wa-notification');
    const closeBtn      = document.getElementById('wa-close-btn');
    const mainBtn       = document.getElementById('wa-main-btn');
    const targetSection = document.getElementById('servicos'); // 3ª seção (gatilho)

    if (!bubble || !typing || !realMessage || !closeBtn || !mainBtn || !targetSection) return;

    const DELAY_BALAO            = 25000; // 25s após entrar na seção
    const DURATION_TYPING        = 2500;  // 2.5s de "digitando..."
    const DURATION_BALAO_VISIVEL = 15000; // 15s exibido depois de aparecer
    const DELAY_BADGE_APOS_SUMIR = 5000;  // 5s após sumir → badge (só nicho tranquilo)

    let triggered = false;
    let autoHideTimer = null;
    let badgeTimer = null;
    let userClosed = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Botão flutuante aparece imediatamente
          mainBtn.classList.add('visible');

          // t=25s → balão sobe
          setTimeout(() => {
            if (userClosed) return;
            bubble.classList.add('show');

            // 2.5s de "digitando..." → mensagem real (classes utilitárias, sem inline style)
            setTimeout(() => {
              if (userClosed) return;
              typing.classList.add('is-hidden');
              realMessage.classList.add('is-visible');
              requestAnimationFrame(() => realMessage.classList.add('is-in'));
            }, DURATION_TYPING);

            // balão some automaticamente
            autoHideTimer = setTimeout(() => {
              if (userClosed) return;
              bubble.classList.remove('show');

              if (!MODO_COMPLIANCE && badge) {
                badgeTimer = setTimeout(() => {
                  if (userClosed) return;
                  badge.classList.add('show');
                }, DELAY_BADGE_APOS_SUMIR);
              }
            }, DURATION_BALAO_VISIVEL);
          }, DELAY_BALAO);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(targetSection);

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userClosed = true;
      bubble.classList.remove('show');
      if (autoHideTimer) clearTimeout(autoHideTimer);
      if (badgeTimer) clearTimeout(badgeTimer);
      if (!MODO_COMPLIANCE && badge) {
        setTimeout(() => { badge.classList.add('show'); }, DELAY_BADGE_APOS_SUMIR);
      }
    });

    mainBtn.addEventListener('click', () => {
      bubble.classList.remove('show');
      if (badge) badge.classList.remove('show');
      if (autoHideTimer) clearTimeout(autoHideTimer);
      if (badgeTimer) clearTimeout(badgeTimer);
    });
  })();

  // ===== SERVIÇOS SPOTLIGHT GRID =====
  const servicosSection = document.getElementById('servicos');
  const servicosSpotlight = document.getElementById('servicos-spotlight');
  const svcTiles = document.querySelectorAll('.svc-tile');
  
  if (servicosSection && servicosSpotlight) {
    servicosSection.addEventListener('mousemove', (e) => {
      const rect = servicosSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      servicosSpotlight.style.setProperty('--mouse-x', `${x}%`);
      servicosSpotlight.style.setProperty('--mouse-y', `${y}%`);
    });
  }
  
  // Tile-level spotlight
  svcTiles.forEach(tile => {
    const spotlight = tile.querySelector('.svc-tile-spotlight');
    if (spotlight) {
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        spotlight.style.setProperty('--tile-x', `${x}%`);
        spotlight.style.setProperty('--tile-y', `${y}%`);
      });
    }
  });

  // ===== PROCESS TIMELINE LINE FILL =====
  const processLineFill = document.getElementById('process-line-fill');
  const processSteps = document.querySelectorAll('.process-step');
  
  if (processLineFill && processSteps.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processLineFill.classList.add('active');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    const timelineContainer = document.querySelector('.process-timeline');
    if (timelineContainer) {
      timelineObserver.observe(timelineContainer);
    }
  }

  // ===== VIDEO HISTORY, GRID & PREMIUM MODAL FUNCTIONS =====
  const modalVideo = document.getElementById('modal-video');
  const premiumModal = document.getElementById('video-premium-modal');
  
  let activeMainVideoElement = null; // Guarda qual vídeo da página foi expandido no modal

  // 1. Play / Pause genérico para todos os vídeos (grid + história)
  window.toggleGridVideoPlay = function(videoId) {
    const video = document.getElementById(videoId);
    if (!video) return;
    
    const container = video.parentElement;
    const playIcon = container.querySelector('.video-play-icon');
    
    // Pausa qualquer outro vídeo que esteja tocando
    document.querySelectorAll('.premium-grid-video').forEach(v => {
      if (v.id !== videoId && !v.paused) {
        v.pause();
        const otherContainer = v.parentElement;
        const otherIcon = otherContainer.querySelector('.video-play-icon');
        if (otherIcon) otherIcon.classList.remove('playing');
        otherContainer.classList.remove('playing');
      }
    });

    if (video.paused) {
      // Desmuta o vídeo ao dar play
      video.muted = false;
      const audioBtn = container.querySelector('.grid-audio-btn');
      if (audioBtn) {
        audioBtn.classList.add('sound-active');
      }

      video.play();
      if (playIcon) playIcon.classList.add('playing');
      container.classList.add('playing');
    } else {
      video.pause();
      if (playIcon) playIcon.classList.remove('playing');
      container.classList.remove('playing');
    }
  };

  // 2. Mute / Unmute genérico para todos os vídeos
  window.toggleGridVideoMute = function(e, videoId) {
    if (e) e.stopPropagation();
    const video = document.getElementById(videoId);
    if (!video) return;
    
    video.muted = !video.muted;
    const audioBtn = video.parentElement.querySelector('.grid-audio-btn');
    
    if (audioBtn) {
      if (video.muted) {
        audioBtn.classList.remove('sound-active');
      } else {
        audioBtn.classList.add('sound-active');
        // Se estava pausado ao tirar o mudo, dá play
        if (video.paused) {
          video.play();
          const container = video.parentElement;
          const playIcon = container.querySelector('.video-play-icon');
          if (playIcon) playIcon.classList.add('playing');
          container.classList.add('playing');
        }
      }
    }
  };

  // 4.5. Barra de Progresso dos Vídeos (todos os vídeos premium)
  (function initVideoProgressBars() {
    const allVideos = document.querySelectorAll('.premium-grid-video');
    
    allVideos.forEach(video => {
      const progressBar = video.parentElement.querySelector('.video-progress-bar');
      const progressFill = progressBar ? progressBar.querySelector('.video-progress-fill') : null;
      
      if (!progressBar || !progressFill) return;
      
      // Atualiza a barra conforme o vídeo avança
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          progressFill.style.width = percent + '%';
        }
      });
      
      // Reseta a barra quando o vídeo termina/loopa
      video.addEventListener('ended', () => {
        progressFill.style.width = '0%';
      });
      
      // Permite clicar na barra para pular para uma posição
      progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.duration) {
          const rect = progressBar.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percent = clickX / rect.width;
          video.currentTime = percent * video.duration;
          
          // Se estava pausado, dá play
          if (video.paused) {
            toggleGridVideoPlay(video.id);
          }
        }
      });
    });
  })();

  // 5. Abrir Modal Premium com Vídeo Dinâmico (serve para história ou grid)
  window.openPremiumModalDynamic = function(e, videoId) {
    if (e) e.stopPropagation();
    const sourceVideo = document.getElementById(videoId);
    if (!sourceVideo || !modalVideo || !premiumModal) return;

    activeMainVideoElement = sourceVideo;

    // Atualiza a fonte de mídia no modal baseada no vídeo de origem
    const sourceElement = sourceVideo.querySelector('source');
    if (sourceElement) {
      modalVideo.src = sourceElement.src;
      modalVideo.load(); // Recarrega o player do modal
    }

    // Sincroniza currentTime e volume/muted
    modalVideo.currentTime = sourceVideo.currentTime;
    modalVideo.muted = sourceVideo.muted;

    // Pausa o vídeo de origem
    sourceVideo.pause();
    const playIcon = sourceVideo.parentElement.querySelector('.video-play-icon');
    if (playIcon) playIcon.classList.remove('playing');

    // Abre o modal e inicia
    premiumModal.classList.add('active');
    modalVideo.play();
  };

  // Atalho para manter compatibilidade com o vídeo da história
  window.openPremiumModal = function(e) {
    window.openPremiumModalDynamic(e, 'historia-video');
  };

  // 6. Fechar Modal Premium (Sincroniza de volta para o player correto na página)
  window.closePremiumModal = function() {
    if (!modalVideo || !premiumModal) return;

    modalVideo.pause();
    premiumModal.classList.remove('active');

    if (activeMainVideoElement) {
      // Sincroniza currentTime e muted de volta
      activeMainVideoElement.currentTime = modalVideo.currentTime;
      activeMainVideoElement.muted = modalVideo.muted;

      // Atualiza os botões correspondentes na página
      if (activeMainVideoElement.id === 'historia-video') {
        if (btnPageAudio) {
          if (activeMainVideoElement.muted) {
            btnPageAudio.classList.remove('sound-active');
          } else {
            btnPageAudio.classList.add('sound-active');
          }
        }
      } else {
        const gridAudioBtn = activeMainVideoElement.parentElement.querySelector('.grid-audio-btn');
        if (gridAudioBtn) {
          gridAudioBtn.innerHTML = activeMainVideoElement.muted ? '<span class="btn-icon">🔇</span>' : '<span class="btn-icon">🔊</span>';
        }
      }

      // Reinicia reprodução na página e ativa ícone correspondente
      activeMainVideoElement.play();
      const playIcon = activeMainVideoElement.parentElement.querySelector('.video-play-icon');
      if (playIcon) playIcon.classList.add('playing');
      
      // Adiciona classe playing no container para controles sempre visíveis
      const parentContainer = activeMainVideoElement.parentElement;
      if (parentContainer) parentContainer.classList.add('playing');
      
      activeMainVideoElement = null; // Reseta referência
    }
  };

  // ===== PARAR VÍDEOS AO SAIR DA SEÇÃO =====
  const sectionsWithVideos = document.querySelectorAll('#sobre, #videos-premium');
  if (sectionsWithVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          const sectionVideos = entry.target.querySelectorAll('video');
          sectionVideos.forEach(video => {
            if (!video.paused) {
              video.pause();
              const container = video.parentElement;
              if (container) {
                container.classList.remove('playing');
                const playIcon = container.querySelector('.video-play-icon');
                if (playIcon) playIcon.classList.remove('playing');
              }
            }
            video.currentTime = 0;
          });
        }
      });
    }, {
      threshold: 0
    });
    sectionsWithVideos.forEach(section => videoObserver.observe(section));
  }

  // ===== CALCULADORA DE EMPRÉSTIMO =====
  // Seleção de órgão: o INSS (com data-taxa) abre o simulador;
  // os demais órgãos não simulam e direcionam para o WhatsApp.
  window.selectOrgao = function(btn) {
    const taxa = btn.getAttribute('data-taxa');

    // Órgão sem simulador (sem taxa) → redireciona para o WhatsApp
    if (!taxa) {
      const orgao = btn.getAttribute('data-orgao') || '';
      const msg = `Olá, vim através do site e gostaria de simular meu empréstimo consignado (órgão: ${orgao}).`;
      window.open(`https://wa.me/5521980092063?text=${encodeURIComponent(msg)}`, '_blank');
      return;
    }

    // Órgão simulável (INSS) → ativa o botão e recalcula
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    updateCalculator();
  };

  window.updateCalculator = function() {
    const valSlider = document.getElementById('calc-val-slider');
    const parcSlider = document.getElementById('calc-parc-slider');
    const valTxt = document.getElementById('calc-val-txt');
    const parcTxt = document.getElementById('calc-parc-txt');
    const parcelaVal = document.getElementById('calc-parcela-val');
    const taxaVal = document.getElementById('calc-taxa-val');
    const whatsappBtn = document.getElementById('calc-whatsapp-btn');

    if (!valSlider || !parcSlider) return;

    const valor = parseFloat(valSlider.value);
    const parcelas = parseInt(parcSlider.value);
    
    const activeTab = document.querySelector('.calc-tab.active');
    const taxa = activeTab ? parseFloat(activeTab.getAttribute('data-taxa')) : 0.018;

    // Atualiza os textos dos displays
    valTxt.innerText = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    parcTxt.innerText = `${parcelas} meses`;

    // Atualiza a exibição da taxa em porcentagem
    taxaVal.innerText = `${(taxa * 100).toFixed(2)}% a.m.`;

    // Calcula a parcela usando a fórmula Price: P = V * [i * (1 + i)^n] / [(1 + i)^n - 1]
    const parcela = valor * (taxa * Math.pow(1 + taxa, parcelas)) / (Math.pow(1 + taxa, parcelas) - 1);
    
    // Formatado como moeda brasileira
    const parcelaFormatada = parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    parcelaVal.innerText = parcelaFormatada;

    // Atualiza o link do WhatsApp com mensagem personalizada estruturada
    const orgaoName = activeTab ? (activeTab.getAttribute('data-orgao') || activeTab.innerText) : 'INSS';
    const whatsappBaseUrl = "https://wa.me/5521980092063";
    const whatsappText = `Olá, vim através do site e gostaria de solicitar uma análise de crédito com base na minha simulação:

- Órgão: ${orgaoName}
- Operação: Empréstimo Consignado
- Valor Simulado: R$ ${valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
- Prazo Simulado: ${parcelas} parcelas (meses)
- Parcela Estimada: ${parcelaFormatada}
- Taxa Mensal Referência: ${(taxa * 100).toFixed(2)}% a.m.`;

    whatsappBtn.href = `${whatsappBaseUrl}?text=${encodeURIComponent(whatsappText)}`;
  };

  // Função segura para abrir WhatsApp da calculadora (garante que o href foi atualizado)
  window.openCalcWhatsApp = function(e) {
    e.preventDefault();
    const btn = document.getElementById('calc-whatsapp-btn');
    if (!btn) return;
    
    // Força atualização do href antes de abrir
    updateCalculator();
    
    // Abre o link em nova aba
    const href = btn.getAttribute('href');
    if (href && href !== 'javascript:void(0);') {
      window.open(href, '_blank');
    }
  };

  // Inicializa a calculadora
  updateCalculator();

  console.log('🟡 RégliCred — Site carregado com sucesso');
  } catch (error) {
    console.error('🛑 ERRO CRÍTICO no JavaScript:', error);
    console.error('Stack trace:', error.stack);
    // Garante que o loading screen desapareça mesmo com erro
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.classList.add('loaded');
  }
});
