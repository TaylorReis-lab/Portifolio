# Documentação - Portfólio 📄

Este documento descreve o que o script faz, como estender o comportamento básico e sugestões de próximos passos.

---

## Visão Geral

- Arquivos principais:
  - `index.html` — HTML principal do site.
  - `script.js` — Comportamentos JS (tema, rolagem, handlers básicos).

## O que cada coisa faz 🧩

### Tema (light/dark)

- Chave no localStorage: `theme`.
- Se o usuário já escolheu (salvo em localStorage), o site usa essa preferência.
- Caso contrário, o script usa a preferência do sistema (`prefers-color-scheme`).
- Botão: `#theme-toggle` — alterna o tema e atualiza o ícone `#theme-icon`.
- Meta `theme-color` é atualizado para combinar com o tema (útil em mobile).

### Rolagem suave

- Links internos (`a[href^="#"]`) fazem `scrollIntoView({behavior: 'smooth'})` e atualizam o hash.
- Botões com IDs úteis:
  - `#btn-work` — rola para `#projects`.
  - `#btn-see-all` — rola para `#projects`.
  - `#btn-chat` — rola para `#contact`.

### Projetos (placeholders)

- Os ícones de overlay nos cards abrem URLs de exemplo:
  - `link` → abre `https://example.com` (substituir por link do projeto)
  - `code` → abre `https://github.com` (substituir por repositório do projeto)

**Boas práticas:** adicione atributos nos cartões de projeto para URLs reais:

- `data-link="https://meuprojeto.com"`
- `data-repo="https://github.com/meu/repo"`

O script irá checar esses atributos antes de abrir algo (caso queira implementar essa lógica).

### Acessibilidade e atalhos

- Atalho: `Ctrl/Cmd + T` — alterna tema.
- O botão de tema recebe `aria-pressed` para indicar estado.

---

## Como estender (tarefas recomendadas) ✅

1. Substituir os placeholders dos cards por `data-link` / `data-repo` e ajustar `script.js` para abrir os links corretos.
2. Adicionar animações no botão de tema e feedback visual (toasts) para ações importantes.
3. Implementar formulários reais para contato (p. ex. Netlify Forms ou integração com backend).
4. Adicionar testes básicos (unitários ou E2E com Playwright/Cypress).
5. Verificar e melhorar acessibilidade (foco, contraste, roles e labels).

---

## Como testar localmente 🧪

1. Abrir `index.html` num navegador (duplo clique) ou usar um servidor simples:
   - `npx http-server` (ou `python -m http.server`).
2. Testar: alternar tema, usar atalhos, clicar nos botões e nos ícones dos cards.

---

## Comandos git recomendados

```bash
git add .
git commit -m "feat: add base script and documentation"
git push
```

---

Se quiser, posso:

- Atualizar os cards para usarem `data-link`/`data-repo` e implementar a lógica de abrir esses links. ✅
- Criar um arquivo `assets/js/main.js` e mover o script para lá (modularizar).

Diga qual opção prefere e eu implemento.

---

## Internacionalização (i18n) 🌐

- O site agora possui um botão de idioma (`#lang-toggle`) que alterna entre **English (EN)** e **Português (PT-BR)**.
- Traduções são definidas em `script.js` dentro do objeto `translations`.

Como adicionar/editar traduções:

1. Identifique o elemento que deve ser traduzido e adicione o atributo `data-i18n="chave"`.
2. Para textos que precisam de HTML (ex.: span com destaque), use `data-i18n-html="true"` e coloque a chave correspondente no `translations`.
3. Atualize `script.js` em `translations.en` e `translations.pt` com a nova chave e valor.

Comportamento:

- A preferência do idioma é salva em `localStorage` sob a chave `lang`.
- Se o usuário não tiver uma preferência salva, o idioma padrão segue `navigator.language` (pt-\* → PT, caso contrário → EN).

> ⚠️ Observação de performance: a varredura automática do DOM para _registrar_ textos e gerar chaves de tradução pode deixar o carregamento lento em páginas maiores. Essa funcionalidade está desativada por padrão para manter o site rápido. Se quiser ativar manualmente, execute `window.enableAutoI18n()` no console (e `window.disableAutoI18n()` para parar o observador).

---

## Tags de tecnologia nos projetos ⭐

- Padrão: adicione `data-tags="Tag1,Tag2"` no elemento do cartão de projeto (`.group`) para indicar as tecnologias usadas (ex.: `data-tags="React,Stripe"`).
- O script exibirá automaticamente essas tags no formato padrão (estilos, caixa, uppercase) para todos os projetos, inclusive os adicionados dinamicamente.
- Para o modal paginado, inclua `tags: ['Tag1','Tag2']` ao objeto de projeto em `additionalProjects`.

Exemplo de `additionalProjects`:

```js
{ title: 'Nova Loja', desc: '...', img: '...', link: '...', repo: '...', tags: ['React','Stripe'] }
```

Isso garante consistência visual entre projetos fixos e dinâmicos.

---

Se quiser, posso automaticamente converter mais textos em `index.html` para usar `data-i18n` com valores de exemplo.
