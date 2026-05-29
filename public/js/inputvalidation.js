const formCadastro = document.getElementById('form-cadastro')
const formLogin = document.getElementById('form-login')
const divResultado = document.getElementById('resultado')

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
            return divResultado.textContent = dados.message    
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
            return divResultado.textContent = dados.message    
        }

        window.location.href = '/'
    })
}