const botao = document.getElementById('botaoConta')
const menu = document.getElementById('menuFlutuante')
const seta = document.getElementById('seta')
const finalHeader = document.querySelector('.finalHeader')

botao.addEventListener('click', e => {
    if(menu.classList.contains('desativado')){
        menu.classList.remove('desativado')
        botao.classList.remove('bordaCompleta')
        botao.classList.add('bordaImcompleta')
        seta.classList.remove('cima')
        seta.classList.add('baixo')
        console.log('aqui')
    } else {
        menu.classList.add('desativado')
        botao.classList.remove('bordaImcompleta')
        botao.classList.add('bordaCompleta')
        seta.classList.remove('baixo')
        seta.classList.add('cima')
        console.log('aqui2');
    }
})