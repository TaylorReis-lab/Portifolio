(function () {
  "use strict";

  // ---------- Config / Seletores ----------
  // Theme logic moved to theme.js
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

  // Helper to open external links in a safe new tab
  function openExternal(url) {
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      // fallback
      window.open(url, "_blank");
    }
  }

  // Open the contact Signal link in a new tab
  const btnSayHello = document.getElementById("btn-say-hello");
  if (btnSayHello) {
    btnSayHello.addEventListener("click", () => {
      openExternal(
        "https://signal.me/#eu/_hU56h7yNME5tlOoPByNRLWzJVUk14FTQU__WybpxDK1tfNmqTJEprLpxWy_Q_OG",
      );
    });
  }

  // Open the GitHub profile in a new tab
  const btnViewGithub = document.getElementById("btn-view-github");
  if (btnViewGithub) {
    btnViewGithub.addEventListener("click", () => {
      openExternal("https://github.com/TaylorReis-lab");
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
    // Add flex classes for wrapping and spacing
    container.classList.add("flex", "flex-wrap", "gap-2");
    container.style.rowGap = "0.5rem";
    container.style.columnGap = "0.5rem";
    // Color palette for tags
    const colorClasses = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
      "bg-orange-100 text-orange-800",
      "bg-gray-100 text-gray-800",
    ];
    function getColorClass(tag) {
      let hash = 0;
      for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colorClasses[Math.abs(hash) % colorClasses.length];
    }
    tags.forEach((tag, idx) => {
      const s = document.createElement("span");
      s.className = `px-2 py-1 text-[10px] font-bold rounded uppercase ${getColorClass(tag)}`;
      s.textContent = tag;
      container.appendChild(s);
    });
    // Custom: force max 2 tags per row by setting a max-width if needed
    // (Assumes each tag is ~80px wide, adjust as needed)
    if (tags.length > 2) {
      container.style.maxWidth = `${2 * 100}px`;
    } else {
      container.style.maxWidth = "unset";
    }
  }

  // Function for downloading CV PDF
  const btnDownloadCV = document.getElementById("btn-cv");
  if (btnDownloadCV) {
    btnDownloadCV.addEventListener("click", (e) => {
      e.preventDefault();

      // Get current language
      const currentLang = localStorage.getItem("lang") || "en";

      // CV links by language
      const CV_LINKS = {
        pt: "https://drive.google.com/file/d/1RuDiSgnwkXgnTmIiBT8Rrm0oUW0HSTpt/view?usp=drive_link",
        en: "https://drive.google.com/file/d/12bQymb56Skofn8y1EKqOSTzh4dF7e-xN/view?usp=sharing",
      };

      const cvUrl = CV_LINKS[currentLang] || CV_LINKS.en;
      openExternal(cvUrl);
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
  // (Moved to i18n.js)
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

  // Load GitHub repositories dynamically and generate card data (title, desc, img, link, repo, tags, legend)
  const GITHUB_USER = "TaylorReis-lab";
  let additionalProjects = []; // populated by fetchGithubProjects()

  const PAGE_SIZE = 6; // cards per page
  let currentModalPage = 0;
  let totalModalPages = 1;

  // Generate simple tags and legend from repo metadata
  function inferTagsAndLegend(repo) {
    const tags = [];
    if (repo.language) tags.push(repo.language);
    if (repo.homepage) tags.push("Demo");
    if (repo.fork) tags.push("Fork");
    const lower = (
      (repo.name || "") +
      " " +
      (repo.description || "")
    ).toLowerCase();
    if (lower.includes("bot")) tags.push("Bot");
    if (lower.includes("chat")) tags.push("Chat");
    if (lower.includes("api")) tags.push("API");
    if (
      lower.includes("ecommerce") ||
      lower.includes("e-commerce") ||
      lower.includes("shop")
    )
      tags.push("E-commerce");
    // dedupe
    return [...new Set(tags)].filter(Boolean);
  }

  async function fetchGithubProjects() {
    try {
      const resp = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=200&sort=pushed`,
      );
      if (!resp.ok) throw new Error(`GitHub API returned ${resp.status}`);
      const repos = await resp.json();

      additionalProjects = repos
        .filter((r) => r.name !== "TaylorReis-lab") // Exclude main profile repo
        .filter((r) => r.name !== "Portifolio" && !r.private)
        .map((r) => {
          const tags = inferTagsAndLegend(r);
          const desc =
            r.description ||
            (r.homepage ? "Demo available" : "No description provided");
          const img = `https://opengraph.githubassets.com/1/${r.full_name}`;
          const legend =
            `${r.language || ""}${r.pushed_at ? ` • Updated ${new Date(r.pushed_at).toLocaleDateString()}` : ""}`.trim();
          return {
            title: r.name,
            desc,
            img,
            link: r.homepage || r.html_url,
            repo: r.html_url,
            tags,
            legend,
          };
        });

      totalModalPages = Math.max(
        1,
        Math.ceil(additionalProjects.length / PAGE_SIZE),
      );
      // If the modal is already in DOM, render first page so content becomes available immediately
      if (modal) renderModalPage(0);
      // Also update the featured project cards on the main page
      updateFeaturedProjects();
    } catch (err) {
      console.error("fetchGithubProjects failed:", err);
    }
  }

  // Update featured project cards on the page from fetched repos
  function updateFeaturedProjects() {
    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;
    const grid = projectsSection.querySelector(".grid");
    if (!grid) return;
    const cards = grid.querySelectorAll(".group");
    const count = Math.min(cards.length, additionalProjects.length);
    for (let i = 0; i < count; i++) {
      const card = cards[i];
      const repo = additionalProjects[i];
      if (!repo) continue;

      // Update image
      const img = card.querySelector("img");
      if (img) img.src = repo.img || img.src;

      // Update title element (remove data-i18n to avoid overwrite)
      const titleEl = card.querySelector("h3, h4, h5");
      if (titleEl) {
        titleEl.textContent = repo.title;
        titleEl.removeAttribute("data-i18n");
      }

      // Update description (use last <p> inside card)
      const pEls = card.querySelectorAll("p");
      if (pEls && pEls.length) {
        const descEl = pEls[pEls.length - 1];
        if (descEl) {
          descEl.textContent = repo.desc;
          descEl.removeAttribute("data-i18n");
        }
      }

      // Set link/repo data attributes so other logic can use them
      card.dataset.link = repo.link || "";
      card.dataset.repo = repo.repo || "";

      // Ensure tag container exists and render tags
      let tagInner = card.querySelector(".project-tags");
      if (!tagInner) {
        const meta =
          card.querySelector(".p-8") || card.querySelector(".p-6") || card;
        const container = document.createElement("div");
        container.className = "flex gap-2 project-tags-container";
        const inner = document.createElement("div");
        inner.className = "project-tags";
        container.appendChild(inner);
        if (meta) meta.insertBefore(container, meta.firstChild);
        tagInner = inner;
      }
      // Update tags via dataset and renderer
      card.dataset.tags = (repo.tags || []).join(",");
      renderTagsInto(tagInner, repo.tags || []);

      // Reattach icon click handlers (replace nodes to remove previous listeners)
      const icons = card.querySelectorAll(".material-symbols-outlined");
      icons.forEach((icon) => {
        const newIcon = icon.cloneNode(true);
        icon.parentNode.replaceChild(newIcon, icon);
        newIcon.style.cursor = "pointer";
        newIcon.addEventListener("click", () => {
          const name = newIcon.textContent.trim().toLowerCase();
          if (name === "link")
            openExternal(repo.link || repo.repo || "https://example.com");
          if (name === "code")
            openExternal(repo.repo || repo.link || "https://github.com");
        });
      });
    }
  }

  // Load on startup (non-blocking) and start auto-refresh
  fetchGithubProjects();

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
              <p class="text-xs text-gray-400">${p.legend || ""}</p>
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
})();
