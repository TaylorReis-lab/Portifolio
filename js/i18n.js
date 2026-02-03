// i18n.js - Translation and language logic
;(function () {
  'use strict'
  const LANG_KEY = 'lang'
  const langToggle = document.getElementById('lang-toggle')
  const langLabel = document.getElementById('lang-label')
  // translations object should be defined globally or imported
  if (!window.translations) return

  function applyTranslations(lang) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      const value = window.translations[lang] && window.translations[lang][key] ? window.translations[lang][key] : ''
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = value
      } else {
        el.textContent = value
      }
    })
    if (langToggle) {
      langToggle.dataset.lang = lang
      if (langLabel) langLabel.textContent = lang === 'pt' ? 'PT' : 'EN'
    }
  }

  function initLang() {
    const saved = localStorage.getItem(LANG_KEY)
    const navLang = (navigator.language || navigator.userLanguage || 'en').startsWith('pt') ? 'pt' : 'en'
    const lang = saved || navLang
    applyTranslations(lang)
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = langToggle.dataset.lang === 'pt' ? 'pt' : 'en'
      const next = current === 'pt' ? 'en' : 'pt'
      localStorage.setItem(LANG_KEY, next)
      applyTranslations(next)
    })
  }

  window.applyTranslations = applyTranslations
  window.initLang = initLang
  // Call on load
  initLang()
})()
