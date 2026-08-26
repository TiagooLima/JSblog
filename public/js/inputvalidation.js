const formCadastro = document.getElementById('form-cadastro')
const formLogin = document.getElementById('form-login')
const formUpdate = document.getElementById('update')
const divResultado = document.getElementById('resultado')
const formAvatarUpgrade = document.getElementById('avatar-upgrade')

/* formulario de cadastro */
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

/* formulario de login */
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

if(formUpdate){
    formUpdate.addEventListener('submit', async e => {
        e.preventDefault()

        const nome = document.getElementById('nome').value
        const email = document.getElementById('email').value
        const senha = document.getElementById('senha').value
        const senha2 = document.getElementById('senha2').value

        const resposta = await fetch('/minhaconta', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({nome, email, senha, senha2})
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

        window.location.href = '/minhaconta'
    })
}

if(formAvatarUpgrade){
    const inputAvatar = document.getElementById('avatar')
    formAvatarUpgrade.addEventListener('submit', async e => {
        e.preventDefault()
        const imgEnviada = inputAvatar.files[0];
        if (!imgEnviada) {
            divResultado.textContent = 'Envie pelo menos uma imagem'  
            divResultado.style.opacity = 1

            divResultado.addEventListener('click', () => {
                divResultado.style.opacity = 0;
            })
            
            setTimeout(() => {
                divResultado.style.opacity = '0';
            }, 1000*7)
            return
        }

        // conversão pra base64 -- função padrão documentada
        function converteImagemParaBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        }
        const base64imagem = await converteImagemParaBase64(imgEnviada)
        const resposta = await fetch('/minhaconta/foto', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ img: base64imagem })
        })

        if (resposta.status === 413) {
            divResultado.textContent = 'A imagem selecionada é muito grande. Escolha uma foto menor (máx. 10MB).';
            divResultado.style.opacity = 1

            divResultado.addEventListener('click', () => {
                divResultado.style.opacity = 0;
            })
            
            setTimeout(() => {
                divResultado.style.opacity = '0';
            }, 1000*8)
            return;
        }

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

        window.location.reload()
        

        
    })
}