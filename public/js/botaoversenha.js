const checkSenha = document.querySelector('.checkboxInput')
const inputSenha = document.getElementById('senha')
const inputSenha2 = document.getElementById('senha2')

let c = 0
checkSenha.addEventListener('click', e => {
    if(c === 0){
        inputSenha.style.fontSize = '1.2em'
        inputSenha.setAttribute("type", "text");
        inputSenha2.style.fontSize = '1.2em'
        inputSenha2.setAttribute("type", "text");
        c++
    }else{
        inputSenha.setAttribute("type", "password");
        inputSenha.style.fontSize = '2em'
        inputSenha2.setAttribute("type", "password");
        inputSenha2.style.fontSize = '2em'
        c--
    }
})