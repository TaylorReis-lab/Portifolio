const dowloadCurriculum = document.querySelector(".cv-btn")
const buttonAbout = document.querySelector(".button-about")
const buttonSkills = document.querySelector(".button-skills")
const list = document.querySelector(".rule")
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
    <h1>Hard Skills</h1>
    <p>
    </p>
    `
}


buttonSkills.addEventListener("click", mostSkill)
buttonAbout.addEventListener("click", mostAbout)
dowloadCurriculum.addEventListener("click", download)