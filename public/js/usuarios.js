//const urlBase = 'https://backend-mongodb-pi.vercel.app/api'
const urlBase = 'http://localhost:4000/api'
const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"))
const access_token = localStorage.getItem("token") || null


async function carregaUsers() {
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' 
    await fetch(`${urlBase}/usuarios`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access-token": access_token //envia o token na requisição
        }
    })
        .then(response => response.json())
        .then(data => {

            data.forEach(usuarios => {

                tabela.innerHTML += `
                <tr>
                   <td>${usuarios.nome}</td>
                   <td>${usuarios.email}</td>

                   <td>
                       <button class='btn btn-danger btn-sm' onclick='removeUser("${usuarios._id}")'>🗑 Excluir </button>
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