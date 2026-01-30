/**
 * script.js - Comportamentos base para o site (comentado)
 *
 * Funções fornecidas:
 *  - Controle de tema com persistência (localStorage) e sync com o sistema
 *  - Atualização da meta `theme-color` para navegadores móveis
 *  - Rolagem suave para anchors e botões principais
 *  - Handlers básicos para ícones de overlay nos cartões de projeto (uso de data attributes)
 *  - Atalho de teclado (Ctrl/Cmd + T) para alternar tema
 *
 * Sugestão: use atributos `data-link` e `data-repo` nos elementos de projeto para controlar
 * os links reais (veja DOCUMENTATION.md para instruções).
 */

(function () {
  "use strict";

  // ---------- Config / Seletores ----------
  const THEME_KEY = "theme"; // Chave usada para persistir a preferência do usuário
  const html = document.documentElement;

  // Elementos esperados no DOM (ver `index.html`)
  const themeToggle = document.getElementById("theme-toggle"); // botão que alterna o tema
  const themeIcon = document.getElementById("theme-icon"); // ícone dentro do botão (Material Symbols)

  // ---------- Tema (light / dark) ----------
  /**
   * Aplica o tema na página:
   * - adiciona/remove a classe `dark` no <html>
   * - atualiza o ícone do botão (dark_mode / light_mode)
   * - atualiza o atributo `aria-pressed` para melhora acessibilidade
   * - atualiza a meta `theme-color` (útil em mobile)
   */
  function applyTheme(theme) {
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    if (themeIcon)
      themeIcon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark");

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute("content", theme === "dark" ? "#101622" : "#ffffff");
  }

  // Retorna true se o sistema preferir modo escuro
  function getSystemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  // Inicializa o tema: prefere localStorage > preferencia do sistema
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else {
      applyTheme(getSystemPrefersDark() ? "dark" : "light");
    }
  }

  initTheme();

  // Toggle via botão: salva preferência em localStorage
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.classList.contains("dark") ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // Se o usuário NÃO salvou preferência explicitamente, sincroniza com mudança do sistema
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // Quando o sistema muda, atualiza o tema apenas se o usuário não tiver uma preferência salva
    mq.addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  // ---------- Rolagem suave para anchors e botões ----------
  // Adiciona rolagem suave para todos os links internos
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const id = this.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + id);
      }
    });
  });

  // Botões com ações rápidas (IDs definidos em index.html)
  const btnWork = document.getElementById("btn-work");
  if (btnWork) {
    btnWork.addEventListener("click", () => {
      const projects = document.getElementById("projects");
      if (projects)
        projects.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const btnSeeAll = document.getElementById("btn-see-all");
  if (btnSeeAll) {
    btnSeeAll.addEventListener("click", () => {
      const projects = document.getElementById("projects");
      if (projects)
        projects.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const btnChat = document.getElementById("btn-chat");
  if (btnChat) {
    btnChat.addEventListener("click", () => {
      const contact = document.getElementById("contact");
      if (contact)
        contact.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ---------- Handlers para os cartões de projeto ----------
  /**
   * Expectativa de marcação HTML para cada cartão de projeto:
   * <div class="group" data-link="https://meuprojeto.com" data-repo="https://github.com/meu/repo">...</div>
   *
   * - data-link: link público do projeto (demo)
   * - data-repo: repositório do projeto
   *
   * A lógica abaixo procura os ícones `link` e `code` dentro de cada cartão e abre a URL correta.
   */
  // Utility: render tags into a container element
  function renderTagsInto(container, tags) {
    if (!container) return;
    container.innerHTML = ""; // reset
    tags.forEach((tag) => {
      const s = document.createElement("span");
      s.className =
        "px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase";
      s.textContent = tag;
      container.appendChild(s);
    });
  }

  // Ensure each project card has a standard .project-tags rendered from data-tags
  function ensureProjectCardTags(card) {
    if (!card) return;
    const tagContainer = card.querySelector(".project-tags");
    let tags = [];
    if (card.dataset.tags) {
      tags = card.dataset.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (tagContainer && tagContainer.children.length) {
      // If there are existing spans, collect text and move to data-tags
      tags = Array.from(tagContainer.children)
        .map((c) => c.textContent.trim())
        .filter(Boolean);
      if (tags.length) card.dataset.tags = tags.join(",");
    }
    if (tagContainer) renderTagsInto(tagContainer, tags);
  }

  // Apply to existing cards (ensures consistency)
  document.querySelectorAll(".group").forEach((card) => {
    const linkUrl = card.dataset.link; // ex.: https://meuprojeto.com
    const repoUrl = card.dataset.repo; // ex.: https://github.com/meu/repo

    card.querySelectorAll(".material-symbols-outlined").forEach((icon) => {
      // Define cursor e listener para os ícones de overlay
      icon.style.cursor = "pointer";
      icon.addEventListener("click", () => {
        const name = icon.textContent.trim().toLowerCase();

        if (name === "link") {
          // Prioriza data-link, senão fallback para example
          const url = linkUrl || "https://example.com";
          window.open(url, "_blank");
          return;
        }

        if (name === "code") {
          // Prioriza data-repo, senão usa data-link, senão fallback para github
          const url = repoUrl || linkUrl || "https://github.com";
          window.open(url, "_blank");
          return;
        }

        // Outros ícones podem ser tratados aqui (ex: share, download, preview)
      });
    });

    // Ensure tags render
    ensureProjectCardTags(card);
  });

  // Also ensure newly added cards get tags rendered (MutationObserver will handle translation, we add tag ensure too)
  // When nodes are added, scan them for .group and ensure tags
  // Note: observer already exists below; we'll rely on it to call ensureProjectCardTags via scanAndRegisterTextNodes replaced call

  // ---------- Internationalization (EN / PT-BR) ----------
  // Language persistence key
  const LANG_KEY = "lang";
  const langToggle = document.getElementById("lang-toggle");
  const langLabel = document.getElementById("lang-label");

  // Perf: auto i18n scanning can be expensive (walks the whole DOM).
  // Disable by default to keep page load snappy. Call `window.enableAutoI18n()` to turn on.
  const AUTO_I18N_ENABLED = false;

  // Translation dictionary — keep small and explicit for now
  const translations = {
    en: {
      brand: "Taylor.dev",
      "nav.about": "About",
      "nav.projects": "Projects",
      "nav.contact": "Contact",
      "badge.available": "AVAILABLE FOR HIRE",
      "hero.title":
        "Hi, I'm Taylor, <span class='text-primary'>Full Stack</span> Developer",
      "hero.desc":
        "Building scalable web applications with modern technologies. Focused on high performance and exceptional user experiences.",
      "btn.view": "View My Work",
      "btn.cv": "Download CV",
      "btn.chat": "Let's Chat",
      "tech.title": "My Tech Stack",
      "tech.php": "PHP",
      "tech.csharp": "C#",
      "projects.title": "Featured Projects",
      "projects.desc":
        "Selected work from my recent portfolio. Every project is built from scratch with clean, maintainable code.",
      "projects.seeAll": "See All Projects",
      "project.1.title": "Veloce Commerce",
      "project.1.desc":
        "A high-performance e-commerce engine with real-time inventory and Stripe integration.",
      "project.2.title": "Insight Analytics",
      "project.2.desc":
        "Comprehensive data visualization platform for monitoring SaaS performance metrics in real-time.",
      "project.3.title": "Workflow Pro",
      "project.3.desc":
        "Collaborative task management application with nested projects and custom workflows.",
      "cta.title": "Interested in working together?",
      "cta.desc":
        "I'm currently available for freelance projects or full-time roles. Let's build something amazing together.",
      "cta.sayHello": "Say Hello",
      "cta.viewGithub": "View Github",
      "about.heading": "About Me",
      "about.tagline": "Passion meets <br />precision.",
      "about.p1":
        "I am a full-stack developer with over three years of experience in creating digital products that balance technical excellence with user-centric design. My approach is rooted in the belief that great software should be as beautiful on the inside as it is on the outside.",
      "about.p2":
        'I specialize in <span class="text-[#0d121b] dark:text-white font-bold">building robust backend systems</span> that scale effortlessly, while simultaneously crafting <span class="text-[#0d121b] dark:text-white font-bold">intuitive frontend experiences</span> that engage and delight users. Whether it\'s architecting complex APIs or fine-tuning micro-interactions, I bring a meticulous eye for detail to every stage of the development lifecycle.',
      "footer.built": "Built with React, Tailwind & Passion.",
    },
    pt: {
      brand: "Taylor.dev",
      "nav.about": "Sobre",
      "nav.projects": "Projetos",
      "nav.contact": "Contato",
      "badge.available": "DISPONÍVEL PARA TRABALHO",
      "hero.title":
        "Olá, sou Taylor, <span class='text-primary'>Desenvolvedor Full Stack</span>",
      "hero.desc":
        "Construindo aplicações web escaláveis com tecnologias modernas. Foco em alta performance e experiências de usuário excepcionais.",
      "btn.view": "Ver Meus Projetos",
      "btn.cv": "Baixar CV",
      "btn.chat": "Vamos conversar",
      "tech.title": "Minha Stack",
      "tech.php": "PHP",
      "tech.csharp": "C#",
      "projects.title": "Projetos em Destaque",
      "projects.desc":
        "Trabalhos selecionados do meu portfólio recente. Cada projeto é construído do zero com código limpo e mantenível.",
      "projects.seeAll": "Ver Todos os Projetos",
      "project.1.title": "Veloce Commerce",
      "project.1.desc":
        "Uma engine de e-commerce de alta performance com inventário em tempo real e integração Stripe.",
      "project.2.title": "Insight Analytics",
      "project.2.desc":
        "Plataforma de visualização de dados abrangente para monitorar métricas de SaaS em tempo real.",
      "project.3.title": "Workflow Pro",
      "project.3.desc":
        "Aplicativo de gerenciamento de tarefas colaborativo com projetos aninhados e fluxos de trabalho personalizados.",
      "cta.title": "Interessado em trabalhar junto?",
      "cta.desc":
        "Estou disponível para projetos freelance ou vagas em tempo integral. Vamos construir algo incrível juntos.",
      "cta.sayHello": "Diga Olá",
      "cta.viewGithub": "Ver no GitHub",
      "about.heading": "Sobre Mim",
      "about.tagline": "Paixão encontra <br />precisão.",
      "about.p1":
        "Sou desenvolvedor full-stack com mais de cinco anos de experiência na criação de produtos digitais que equilibram excelência técnica com design centrado no usuário. Minha abordagem parte do princípio de que um ótimo software deve ser tão bonito por dentro quanto por fora.",
      "about.p2":
        'Especializo-me em <span class="text-[#0d121b] dark:text-white font-bold">construir sistemas backend robustos</span> que escalam com facilidade, enquanto simultaneamente crio <span class="text-[#0d121b] dark:text-white font-bold">experiências frontend intuitivas</span> que envolvem e encantam os usuários. Seja arquitetando APIs complexas ou aperfeiçoando microinterações, trago um olhar meticuloso para cada etapa do ciclo de desenvolvimento.',
      "footer.built": "Construído com React, Tailwind & Paixão.",
    },
  };

  // Apply translations to elements with [data-i18n]
  function applyTranslations(lang) {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value =
        translations[lang] && translations[lang][key]
          ? translations[lang][key]
          : "";
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    if (langToggle) {
      langToggle.dataset.lang = lang;
      if (langLabel) langLabel.textContent = lang === "pt" ? "PT" : "EN";
    }
  }

  function initLang() {
    const saved = localStorage.getItem(LANG_KEY);
    // Default to navigator language if not set
    const navLang = (
      navigator.language ||
      navigator.userLanguage ||
      "en"
    ).startsWith("pt")
      ? "pt"
      : "en";
    const lang = saved || navLang;
    applyTranslations(lang);
  }

  let currentLang = null;

  initLang();

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const current = langToggle.dataset.lang === "pt" ? "pt" : "en";
      const next = current === "pt" ? "en" : "pt";
      localStorage.setItem(LANG_KEY, next);
      applyTranslations(next);
    });
  }

  // Keep track of last applied language
  const originalTexts = {}; // map key -> original (EN) text (for export/help)

  // Simple slug generator for keys
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-<>]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);
  }

  // Very small naive translator for en -> pt for common words/phrases.
  // This is a fallback only; update translations.pt with better translations via export/import.
  function naiveTranslateToPT(text) {
    const map = {
      about: "Sobre",
      projects: "Projetos",
      contact: "Contato",
      "view my work": "Ver Meus Projetos",
      "download cv": "Baixar CV",
      "available for hire": "DISPONÍVEL PARA TRABALHO",
      "interested in working together?": "Interessado em trabalhar junto?",
      "let's chat": "Vamos conversar",
      "say hello": "Diga Olá",
      "view github": "Ver no GitHub",
      "my tech stack": "Minha Stack",
    };

    // lower-based replace words when possible
    let out = text;
    Object.keys(map).forEach((k) => {
      const re = new RegExp("\\b" + k + "\\b", "ig");
      out = out.replace(re, (m) => {
        // preserve capitalization
        if (m[0] === m[0].toUpperCase()) {
          return map[k].charAt(0).toUpperCase() + map[k].slice(1);
        }
        return map[k];
      });
    });

    return out;
  }

  // Scans the DOM subtree and registers plain text nodes as data-i18n keys if absent
  function scanAndRegisterTextNodes(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (
          node.closest("script, style, noscript") ||
          node.hasAttribute("data-no-i18n")
        )
          return NodeFilter.FILTER_REJECT;
        // skip interactive elements
        const tag = node.tagName && node.tagName.toLowerCase();
        if (["input", "textarea", "select", "button"].includes(tag))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let n;
    while ((n = walker.nextNode())) {
      // ignore if already has key
      if (n.hasAttribute("data-i18n")) continue;

      // Only capture elements without child elements (leaf nodes)
      if (n.children.length === 0) {
        const text = n.textContent && n.textContent.trim();
        if (!text || text.length < 2) continue;

        // use innerHTML if contains HTML tags
        const isHTML = /<[^>]+>/.test(n.innerHTML.trim());
        const base = isHTML ? n.innerHTML.trim() : text;

        // create key
        let keyBase =
          "auto." + slugify(isHTML ? text : base.replace(/\s+/g, " "));
        let key = keyBase;
        let suffix = 1;
        while (
          (translations.en && translations.en[key]) ||
          (translations.pt && translations.pt[key])
        ) {
          key = `${keyBase}-${suffix++}`;
        }

        // assign attribute
        n.setAttribute("data-i18n", key);
        if (isHTML) n.setAttribute("data-i18n-html", "true");

        // store in translations (EN)
        translations.en = translations.en || {};
        translations.pt = translations.pt || {};
        translations.en[key] = base;
        // generate a naive PT translation (to avoid empty strings)
        translations.pt[key] = naiveTranslateToPT(base);

        // remember original
        originalTexts[key] = base;
      }
    }
  }

  // Auto-scan is disabled by default to avoid slowing page load.
  // Call `window.enableAutoI18n()` to run the scan and start watching for new nodes.
  if (AUTO_I18N_ENABLED) {
    scanAndRegisterTextNodes(document.body);
  }

  // Re-apply current language (without forced scanning)
  // determine current language from langToggle or localStorage
  currentLang =
    localStorage.getItem(LANG_KEY) ||
    ((navigator.language || "").startsWith("pt") ? "pt" : "en");
  applyTranslations(currentLang);

  // Auto i18n: disabled by default. Expose functions to enable/disable manually so the
  // expensive DOM walking and live mutation observing only runs when needed.
  let _autoI18nObserver = null;
  window.enableAutoI18n = function () {
    // run initial scan
    try {
      scanAndRegisterTextNodes(document.body);
    } catch (err) {
      console.error("enableAutoI18n: initial scan failed", err);
    }

    // create observer to register newly added text nodes and ensure tags
    _autoI18nObserver = new MutationObserver((mutations) => {
      let added = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          added = true;
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              scanAndRegisterTextNodes(node);
              if (node.matches && node.matches(".group"))
                ensureProjectCardTags(node);
              node.querySelectorAll &&
                node
                  .querySelectorAll(".group")
                  .forEach((g) => ensureProjectCardTags(g));
            }
          });
        }
      }
      if (added) applyTranslations(currentLang);
    });

    _autoI18nObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    console.info(
      "Auto i18n enabled: DOM scan + MutationObserver active. Use window.disableAutoI18n() to stop.",
    );
  };

  window.disableAutoI18n = function () {
    if (_autoI18nObserver) {
      _autoI18nObserver.disconnect();
      _autoI18nObserver = null;
      console.info("Auto i18n disabled.");
    }
  };

  // Expose helper to export translations for editing
  window.i18nExport = function () {
    const data = { en: translations.en || {}, pt: translations.pt || {} };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translations.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    console.info(
      "Translations exported. Edit pt values and re-import via window.i18nImport(json).",
    );
  };

  // Helper to import translations (useful after editing offline)
  window.i18nImport = function (obj) {
    if (!obj || typeof obj !== "object")
      return console.error("Invalid translations object");
    translations.en = translations.en || {};
    translations.pt = translations.pt || {};
    Object.assign(translations.en, obj.en || {});
    Object.assign(translations.pt, obj.pt || {});
    // re-apply current language
    applyTranslations(currentLang);
    console.info("Translations imported and applied.");
  };

  // ---------- All Projects Modal (paginated, animated) ----------
  const allProjectsBtn = document.getElementById("btn-see-all");
  const modal = document.getElementById("projects-modal");
  const modalOverlay = document.getElementById("projects-modal-overlay");
  const modalContent = modal && modal.querySelector(".modal-content");
  const modalGrid = document.getElementById("projects-modal-grid");
  const modalPageIndicator = document.getElementById(
    "projects-modal-page-indicator",
  );
  const modalPagePrev = document.getElementById("projects-modal-page-prev");
  const modalPageNext = document.getElementById("projects-modal-page-next");
  const modalClose = document.getElementById("projects-modal-close");
  const modalNavPrev = document.getElementById("projects-modal-prev");
  const modalNavNext = document.getElementById("projects-modal-next");

  // Example additional projects — replace with real data or extend
  const additionalProjects = [
    {
      title: "Nova Loja",
      desc: "Plataforma e-commerce moderna com checkout otimizado.",
      img: "https://via.placeholder.com/800x600?text=Nova+Loja",
      link: "https://example.com/1",
      repo: "https://github.com",
      tags: ["React", "Stripe"],
    },
    {
      title: "Dash Insight",
      desc: "SaaS analytics com gráficos em tempo real.",
      img: "https://via.placeholder.com/800x600?text=Dash+Insight",
      link: "https://example.com/2",
      repo: "https://github.com",
      tags: ["TypeScript", "Next.js"],
    },
    {
      title: "TaskHero",
      desc: "App de produtividade com cronograma avançado.",
      img: "https://via.placeholder.com/800x600?text=TaskHero",
      link: "https://example.com/3",
      repo: "https://github.com",
      tags: ["Node.js", "PostgreSQL"],
    },
    {
      title: "Portfolio X",
      desc: "Showcase clean com navegação suave.",
      img: "https://via.placeholder.com/800x600?text=Portfolio+X",
      link: "https://example.com/4",
      repo: "https://github.com",
      tags: ["HTML", "CSS"],
    },
    {
      title: "Mobile Hub",
      desc: "PWA para gestão de tarefas.",
      img: "https://via.placeholder.com/800x600?text=Mobile+Hub",
      link: "https://example.com/5",
      repo: "https://github.com",
      tags: ["PWA", "Workbox"],
    },
    {
      title: "AI Studio",
      desc: "Ferramenta de prototipação com IA integrada.",
      img: "https://via.placeholder.com/800x600?text=AI+Studio",
      link: "https://example.com/6",
      repo: "https://github.com",
      tags: ["Python", "TensorFlow"],
    },
    {
      title: "Finance Pro",
      desc: "Painel financeiro com visualizações complexas.",
      img: "https://via.placeholder.com/800x600?text=Finance+Pro",
      link: "https://example.com/7",
      repo: "https://github.com",
      tags: ["D3.js", "React"],
    },
    {
      title: "Collab Board",
      desc: "Quadro colaborativo com notificações em tempo real.",
      img: "https://via.placeholder.com/800x600?text=Collab+Board",
      link: "https://example.com/8",
      repo: "https://github.com",
      tags: ["Socket.io", "Node.js"],
    },
    {
      title: "Design System",
      desc: "Biblioteca de componentes reutilizáveis.",
      img: "https://via.placeholder.com/800x600?text=Design+System",
      link: "https://example.com/9",
      repo: "https://github.com",
      tags: ["Storybook", "Figma"],
    },
  ];

  const PAGE_SIZE = 6; // cards per page
  let currentModalPage = 0;
  const totalModalPages = Math.max(
    1,
    Math.ceil(additionalProjects.length / PAGE_SIZE),
  );

  function renderModalPage(page) {
    currentModalPage = Math.max(0, Math.min(page, totalModalPages - 1));
    const start = currentModalPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = additionalProjects.slice(start, end);

    // simple animation: fade out, replace, fade in
    if (!modalGrid) return;
    modalGrid.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      modalGrid.innerHTML = pageItems
        .map(
          (p) =>
            `<div class="group flex flex-col bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all" data-tags="${p.tags ? p.tags.join(",") : ""}">
            <div class="relative h-48 overflow-hidden">
              <img alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.img}" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <span class="material-symbols-outlined bg-white text-black p-3 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">link</span>
                <span class="material-symbols-outlined bg-white text-black p-3 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">code</span>
              </div>
            </div>
            <div class="p-6 flex flex-col gap-3">
              <div class="flex gap-2 project-tags-container"><div class="project-tags" data-tags="${p.tags ? p.tags.join(",") : ""}"></div></div>
              <h4 class="text-lg font-bold">${p.title}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">${p.desc}</p>
            </div>
        </div>`,
        )
        .join("");

      // reattach click handlers for icons inside modal
      modalGrid.querySelectorAll(".group").forEach((card, idx) => {
        const icons = card.querySelectorAll(".material-symbols-outlined");
        icons.forEach((icon) => {
          icon.style.cursor = "pointer";
          icon.addEventListener("click", () => {
            const name = icon.textContent.trim().toLowerCase();
            const proj = additionalProjects[start + idx];
            if (name === "link")
              window.open(proj.link || "https://example.com", "_blank");
            if (name === "code")
              window.open(proj.repo || "https://github.com", "_blank");
          });
        });
        // render tags for modal cards
        ensureProjectCardTags(card);
      });

      // reattach click handlers for icons inside modal
      modalGrid.querySelectorAll(".group").forEach((card, idx) => {
        const icons = card.querySelectorAll(".material-symbols-outlined");
        icons.forEach((icon) => {
          icon.style.cursor = "pointer";
          icon.addEventListener("click", () => {
            const name = icon.textContent.trim().toLowerCase();
            const proj = additionalProjects[start + idx];
            if (name === "link")
              window.open(proj.link || "https://example.com", "_blank");
            if (name === "code")
              window.open(proj.repo || "https://github.com", "_blank");
          });
        });
      });

      modalGrid.classList.remove("opacity-0", "translate-y-2");
      modalPageIndicator &&
        (modalPageIndicator.textContent = `Page ${currentModalPage + 1} / ${totalModalPages}`);
    }, 160);
  }

  // Modal open/close state guard
  let modalOpen = false;

  function openModal() {
    if (!modal || !modalContent || modalOpen) return;
    modalOpen = true;

    // Push modal slightly down so header doesn't visually overlap controls
    const header = document.querySelector("header");
    if (header) {
      const h = header.offsetHeight || 64;
      modalContent.style.marginTop = h + 12 + "px";
    }

    // Prepare a clean state
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    modal.classList.remove("show");

    modalContent.classList.remove("opacity-0", "translate-y-6");
    // force reflow so transitions reliably start
    void modalContent.offsetWidth;

    modal.classList.add("show");
    modalContent.classList.add("opacity-100", "translate-y-0");

    renderModalPage(0);
    document.body.style.overflow = "hidden";

    // Focus the close button for accessibility
    const closeBtn = document.getElementById("projects-modal-close");
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !modalContent || !modalOpen) return;
    modalOpen = false;

    // start hide transition
    modal.classList.remove("show");
    modalContent.classList.remove("opacity-100", "translate-y-0");
    modalContent.classList.add("opacity-0", "translate-y-6");

    setTimeout(() => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // reset marginTop
      modalContent.style.marginTop = "";

      // move focus back to opener for better UX
      const opener = document.getElementById("btn-see-all");
      opener && opener.focus();
    }, 280);
  }

  if (allProjectsBtn)
    allProjectsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
  if (modalPagePrev)
    modalPagePrev.addEventListener("click", () =>
      renderModalPage(currentModalPage - 1),
    );
  if (modalPageNext)
    modalPageNext.addEventListener("click", () =>
      renderModalPage(currentModalPage + 1),
    );
  if (modalNavPrev)
    modalNavPrev.addEventListener("click", () =>
      renderModalPage(currentModalPage - 1),
    );
  if (modalNavNext)
    modalNavNext.addEventListener("click", () =>
      renderModalPage(currentModalPage + 1),
    );

  // keyboard navigation inside modal
  document.addEventListener("keydown", (e) => {
    if (!modal || modal.classList.contains("hidden")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") renderModalPage(currentModalPage - 1);
    if (e.key === "ArrowRight") renderModalPage(currentModalPage + 1);
  });

  // ---------- Atalhos / Acessibilidade ----------
  // Atalho: Ctrl/Cmd + T para alternar tema
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") {
      e.preventDefault();
      if (themeToggle) themeToggle.click();
    }
  });

  // ---------- TODOS / Possíveis melhorias ----------
  // TODO: adicionar checagem mais robusta (por exemplo, evitar abrir links quando o ícone estiver dentro de outro botão)
  // TODO: adicionar animação/feedback (toasts) quando ações acontecerem
  // TODO: implementar carregamento lazy de imagens e placeholders de loader
})();
