/* ============================================
   RÉGLICRED — JavaScript Vanilla ES6
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
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
        const mensagemExtra = mensagem.value.trim() ? mensagem.value.trim() : 'Não informada';
        
        const whatsappText = `Olá, me chamo ${nome.value.trim()}, vim através do site e gostaria de uma informação.

- E-mail: ${email.value.trim()}
- Telefone: ${telefone.value}
- Serviço: ${tipoOperacao}
- Situação: ${mensagemExtra}`;
        
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

  const marqueeContent = document.getElementById('depo-marquee-content');
  
  function createDepoCard(depo) {
    return `
      <div class="depo-card">
        <div class="depo-stars">★★★★★</div>
        <p class="depo-text">"${depo.texto}"</p>
        <div class="depo-author">${depo.nome}</div>
        <div class="depo-time">${depo.tempo}</div>
      </div>
    `;
  }

  if (marqueeContent) {
    // Create 2 sets for seamless loop
    const cardsHTML = depoimentos.map(createDepoCard).join('');
    marqueeContent.innerHTML = cardsHTML + cardsHTML;
  }

  // ===== NAVBAR LINK ACTIVE STATE =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ===== PAUSE MARQUEE ON HOVER =====
  document.querySelectorAll('.depoimentos-marquee').forEach(marquee => {
    marquee.addEventListener('mouseenter', () => {
      const content = marquee.querySelector('.depo-marquee-content');
      if (content) content.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      const content = marquee.querySelector('.depo-marquee-content');
      if (content) content.style.animationPlayState = 'running';
    });
  });

  // ===== SCROLL TO TOP ON PAGE LOAD =====
  window.scrollTo(0, 0);

  // ===== WHATSAPP PREMIUM EXPERIENCE =====
  function initWaPremium() {
    const bubble = document.getElementById('wa-message-bubble');
    const typing = document.getElementById('wa-typing');
    const realMessage = document.getElementById('wa-real-message');
    const badge = document.getElementById('wa-notification');
    const closeBtn = document.getElementById('wa-close-btn');
    const mainBtn = document.getElementById('wa-main-btn');

    if (!bubble) return;

    // 1. Mostrar o balão após 6 segundos
    setTimeout(() => {
      bubble.classList.add('show');
      
      // 2. Simular digitação por 2.5 segundos antes de mostrar a mensagem
      setTimeout(() => {
        typing.style.display = 'none';
        realMessage.style.display = 'block';
        realMessage.style.opacity = '0';
        realMessage.style.transform = 'translateY(8px)';
        realMessage.style.transition = 'all 0.4s ease';
        
        requestAnimationFrame(() => {
          realMessage.style.opacity = '1';
          realMessage.style.transform = 'translateY(0)';
        });
      }, 2500);

    }, 6000);

    // Fechar balão
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bubble.classList.remove('show');
        // Mostrar notificação após fechar para manter engajamento
        setTimeout(() => {
          if (badge) badge.classList.add('show');
        }, 2000);
      });
    }

    // Ao clicar no botão, remove tudo
    if (mainBtn) {
      mainBtn.addEventListener('click', () => {
        bubble.classList.remove('show');
        if (badge) badge.classList.remove('show');
      });
    }
  }

  initWaPremium();

  console.log('🟡 RégliCred — Site carregado com sucesso');
});
