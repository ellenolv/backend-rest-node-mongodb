const urlBase = 'https://backend-rest-node-mongodb.vercel.app/api'
//const urlBase = 'http://localhost:4000/api';
const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"));
const access_token = localStorage.getItem("token") || null;

// Função que encapsula a chamada de carregaUsers
function inicializar() {
    carregaUsers();
}

async function carregaUsers() {
    const tabela = document.getElementById('dadosTabela');
    tabela.innerHTML = '';

    try {
        const response = await fetch(`${urlBase}/usuarios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar: ${response.statusText}`);
        }

        const data = await response.json();

        data.forEach(usuarios => {
            tabela.innerHTML += `
                <tr>
                   <td>${usuarios.nome}</td>
                   <td>${usuarios.email}</td>
                   <td>
                       <button class='btn btn-danger btn-sm' onclick='removeUser("${usuarios._id}")'>🗑 Excluir </button>
                    </td>           
                </tr>
            `;
        });
    } catch (error) {
        document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao carregar: ${error.message}</span>`;
        resultadoModal.show();
    }
}

async function removeUser(id) {
    if (confirm('Deseja realmente excluir o usuario?')) {
        try {
            const response = await fetch(`${urlBase}/usuarios/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "access-token": access_token //envia o token na requisição
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.deletedCount > 0) {
                carregaUsers(); // atualiza a UI
            }
        } catch (error) {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao carregar: ${error.message}</span>`;
            resultadoModal.show();
        }
    }
}

// Chamada da função inicializar quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", inicializar);
