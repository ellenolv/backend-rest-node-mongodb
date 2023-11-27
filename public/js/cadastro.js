const urlBase = 'https://backend-rest-node-mongodb.vercel.app/api'
//const urlBase = 'http://localhost:4000/api'
document.getElementById("cadastroForm").addEventListener("submit", function (event) {
    event.preventDefault()
    const nome = document.getElementById("nome").value
    const login = document.getElementById("login").value
    const senha = document.getElementById("senha").value
    const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"))

    // Dados do usuário para autenticação
    const dadosCadastro = {
        nome: nome,
        email: login,
        senha: senha
    };

fetch(`${urlBase}/usuarios`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dadosCadastro)
})
    .then(response => response.json())
    .then(data => {
        // Verificar se o token foi retornado        
        if (data.acknowledged) {
            alert('✔ Usuario cadastrado com sucesso!')
            //Limpar o formulário
            window.location.href = "index.html";
        } else if (data.errors) {
            // Caso haja erros na resposta da API
            const errorMessages = data.errors.map(error => error.msg).join("\n");
            // alert("Falha no login:\n" + errorMessages);
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${errorMessages}</span>`
            resultadoModal.show();
        } else {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${JSON.stringify(data)}</span>`
            resultadoModal.show();
        }
    })
    .catch(error => {
        document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao cadastrar: ${error.message}</span>`
        resultadoModal.show();
    });

})

async function carregaUsers() {
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' //Limpa a tabela antes de recarregar
    // Fazer a solicitação GET para o endpoint dos livros
    await fetch(`${urlBase}/usuarios`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access-token": access_token //envia o token na requisição
        }
    })
        .then(response => response.json())
        .then(data => {

            data.forEach(usuario => {

                tabela.innerHTML += `
                <tr>
                   <td>${usuario.nome}</td>
                   <td>${usuario.email}</td>

                   <td>
                       <button class='btn btn-danger btn-sm' onclick='removeUser("${usuario._id}")'>🗑 Excluir </button>
                    </td>           
                </tr>
                `
            })
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao carregar: ${error.message}</span>`
            resultadoModal.show();
        });
}

async function removeUser(id) {
    if (confirm('Deseja realmente excluir o usuario?')) {
        await fetch(`${urlBase}/usuarios/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    //alert('Registro Removido com sucesso')
                    carregaUsers() // atualiza a UI
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao carregar: ${error.message}</span>`
                resultadoModal.show();
            });
    }
}