const checkSenha = document.querySelector('.checkboxInput')
const inputSenha = document.querySelectorAll('.senha')


let c = 0
checkSenha.addEventListener('click', () => {
    if(c === 0){
        inputSenha.forEach(input => {
            input.style.fontSize = '1.2em'
            input.setAttribute("type", "text");
        })        
        c++
    }else{
        inputSenha.forEach(input => {
            input.setAttribute("type", "password");
            input.style.fontSize = '2em'
        })
        c--
    }
})