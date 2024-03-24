//Function Dark Mode
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const isDarkMode = localStorage.getItem("darkMode") === "enabled";
if (isDarkMode) {
  body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});

// Function ShowImgs Projects

function showProject(id) {
  document.getElementById(id).style.display = "block";
}

function hideProject(id) {
  document.getElementById(id).style.display = "none";
}

// Adiciona um evento de clique a todos os links âncora que começam com #
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
  });
});

function loadAboutText() {
  const aboutText = `
<p>
Olá! Sou Taylor Reis, um desenvolvedor Full Stack apaixonado por desafios e inovação. 
Com mais de 2 anos de experiência, mergulhei fundo no
 mundo do desenvolvimento web, especializando-me em back end. 
 Minha missão é ir além das expectativas, criando soluções digitais 
 que não apenas resolvam problemas, mas também inspirem e encantem os usuários.
  Estou constantemente explorando novas tecnologias e abordagens para impulsionar 
  a excelência técnica e entregar resultados excepcionais. 
  Se você procura um profissional comprometido com a qualidade e apaixonado 
  por criar impacto, adoraria discutir como posso contribuir para o sucesso da sua equipe.
</p>
`;
  const aboutSection = document.getElementById("about");
  aboutSection.innerHTML = aboutText;
}

document.addEventListener("DOMContentLoaded", loadAboutText);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function () {
    document.querySelectorAll('a[href^="#"]').forEach((item) => {
      item.classList.remove("active");
    });
    this.classList.add("active");
  });
});

const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const container = document.querySelector('.container');
const maxCards = 3; // Número máximo de cards visíveis
let currentIndex = 0;

function showCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.style.display = i < currentIndex || i >= currentIndex + maxCards ? 'none' : 'inline-block';
  });
}

function nextCard() {
  if (currentIndex + maxCards < document.querySelectorAll('.card').length) {
    currentIndex++;
    showCards();
    manageButtons();
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    showCards();
    manageButtons();
  }
}

function manageButtons() {
  const cards = document.querySelectorAll('.card');
  const cardsCount = cards.length;
  prevButton.disabled = currentIndex <= 0;
  nextButton.disabled = currentIndex + maxCards >= cardsCount;
}

nextButton.addEventListener('click', nextCard);
prevButton.addEventListener('click', prevCard);

showCards();
manageButtons();