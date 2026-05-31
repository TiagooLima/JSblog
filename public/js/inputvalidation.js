const formCadastro = document.getElementById('form-cadastro')
const formLogin = document.getElementById('form-login')
const checkSenha = document.querySelector('.checkboxInput')
const inputSenha = document.getElementById('senha')
const divResultado = document.getElementById('resultado')

let c = 0
checkSenha.addEventListener('click', e => {
    if(c === 0){
        inputSenha.style.fontSize = '1.2em'
        inputSenha.setAttribute("type", "text");
        c++
    }else{
        inputSenha.setAttribute("type", "password");
        inputSenha.style.fontSize = '2em'
        c--
    }
})

if(formCadastro){
    formCadastro.addEventListener('submit', async e => {
        e.preventDefault()

        const nome = document.getElementById('nome').value
        const email = document.getElementById('email').value
        const senha = document.getElementById('senha').value

        const resposta = await fetch('/cadastro', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({nome, email, senha})
        })

        const dados = await resposta.json()
        if(!dados.sucesso){
            divResultado.textContent = dados.message  
            divResultado.style.opacity = 1

            divResultado.addEventListener('click', () => {
                divResultado.style.opacity = 0;
            })
            
            setTimeout(() => {
                divResultado.style.opacity = '0';
            }, 1000*8)
            return
        }

        window.location.href = '/login'
    })
}

if(formLogin){
    formLogin.addEventListener('submit', async e => {
        e.preventDefault()

        const email = document.getElementById('email').value
        const senha = document.getElementById('senha').value
        
        const resposta = await fetch('/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({email, senha})
        })

        const dados = await resposta.json()
        if(!dados.sucesso){
            divResultado.textContent = dados.message  
            divResultado.style.opacity = 1

            divResultado.addEventListener('click', () => {
                divResultado.style.opacity = 0;
            })
            
            setTimeout(() => {
                divResultado.style.opacity = '0';
            }, 1000*8)
            return
        }

        window.location.href = '/'
    })
}