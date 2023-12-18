const dowloadCurriculum = document.querySelector(".cv-btn")
const buttonAbout = document.querySelector(".button-about")
const buttonSkills = document.querySelector(".button-skills")
const buttonPortfo = document.querySelector(".button-portfolio")
const buttonContact = document.querySelector(".button-contact")
const title = document.querySelector(".title")
const list = document.querySelector(".social")
let myLi = ""

function download() {
    window.open("https://drive.google.com/file/d/1PozgkwJm7DuxI0Z2AVA5Q_P_shqfXWIz/view", "_blak")
};

function mostAbout() {
    list.innerHTML = `
    <p>Meu nome é Taylor Reis, Atualmente trabalho como freelancer realizando projetos, e sempre me empenhando e sempre aprimorando
        meus conhecimentos na área, focado em desenvolvimento Full Stack, atualmente trabalho como freelancer, realizando projetos pessoais.
    </p>
    `
}

function mostSkill() {
    list.innerHTML = `
    <ul id="ulSkills">
    <h1>Hard Skills</h1>
        <li>Git</li>
        <li>Github</li>
        <li>HTML</li>
        <li>CSS</li>
        <li>React</li>
        <li>JavaScript</li>
    </ul>
    `
}

function mostPort() {
    list.innerHTML = `
    <ul class="links" >
        <li><a href="https://taylorreis-lab.github.io/Nikel/"><i class="bi bi-globe2"></i></a>Projeto Nikel Gerenciador de Gastos</li>
        <br>
        <li><a href="https://taylorreis-lab.github.io/Projeto-We-Care/"><i class="bi bi-globe2"></i></a>Projeto We Care Pet Shopping</li>
        <br>
        <li><a href="https://taylorreis-lab.github.io/Jokenp--Game/"><i class="bi bi-globe2"></i></a>Projeto Jokenpô</li>
    </ul>
    `
}

function mostContact() {
    title.innerHTML = `Formas de contato abaixo`
    list.innerHTML = `
    <div class="social">
                    <a href="https://github.com/TaylorReis-lab"><i class="bi bi-github"></i></a>
                    <!-- <a href="https://www.youtube.com/taylor__reis"><i class="bi bi-youtube"></i></a> -->
                    <a href="https://www.instagram.com/taylor__reis/"><i class="bi bi-instagram"></i></a>
                    <a href="https://www.linkedin.com/in/taylor--reis/"><i class="bi bi-linkedin"></i></a>
                </div>
    `
}


buttonContact.addEventListener("click", mostContact)
buttonPortfo.addEventListener("click", mostPort)
buttonSkills.addEventListener("click", mostSkill)
buttonAbout.addEventListener("click", mostAbout)
dowloadCurriculum.addEventListener("click", download)