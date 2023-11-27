//const urlBase = 'https://backend-mongodb-pi.vercel.app/api'
const urlBase = 'http://localhost:4000/api'
const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"))
const access_token = localStorage.getItem("token") || null

//evento submit do formulário
document.getElementById('formProduto').addEventListener('submit', function (event) {
    event.preventDefault() // evita o recarregamento
    const idProduto = document.getElementById('id').value
    let produto = {}

    if (idProduto.length > 0) { //Se possuir o ID, enviamos junto com o objeto
        produto = {
            "_id": idProduto,
            "cnpj": document.getElementById('cnpj').value,
            "razao_social": document.getElementById('razao').value,
            "cnae_fiscal": document.getElementById('cnae').value,
            "nome_fantasia": document.getElementById('fantasia').value,
            "data_inicio_atividade": document.getElementById('inicio').value,
            "localizacao": {
                "type": "Point",
                "coordinates": [document.getElementById('lat').value, document.getElementById('long').value]
            }
        }
    } else {
        produto = {
            "cnpj": document.getElementById('cnpj').value,
            "razao_social": document.getElementById('razao').value,
            "cnae_fiscal": document.getElementById('cnae').value,
            "nome_fantasia": document.getElementById('fantasia').value,
            "data_inicio_atividade": document.getElementById('inicio').value,
            "localizacao": {
                "type": "Point",
                "coordinates": [document.getElementById('lat').value, document.getElementById('long').value]
            }
        }
    }
    salvaProduto(produto)
})

async function salvaProduto(produto) {    
    if (produto.hasOwnProperty('_id')) { //Se o produto tem o id iremos alterar os dados (PUT)
        // Fazer a solicitação PUT para o endpoint dos produtos
        await fetch(`${urlBase}/produtos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            },
            body: JSON.stringify(produto)
        })
            .then(response => response.json())
            .then(data => {
                // Verificar se o token foi retornado        
                if (data.acknowledged) {
                    alert('✔ produto alterado com sucesso!')
                    //Limpar o formulário
                    document.getElementById('fromProdutos').reset()
                    //Atualiza a UI
                    carregaProduto()
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
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o produto: ${error.message}</span>`
                resultadoModal.show();
            });

    } else { //caso não tenha o ID, iremos incluir (POST)
        // Fazer a solicitação POST para o endpoint dos produtos
        await fetch(`${urlBase}/produtos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            },
            body: JSON.stringify(produtos)
        })
            .then(response => response.json())
            .then(data => {
                // Verificar se o token foi retornado        
                if (data.acknowledged) {
                    alert('✔ Produtos incluído com sucesso!')
                    //Limpar o formulário
                    document.getElementById('formProduto').reset()
                    //Atualiza a UI
                    carregaProdutos()
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
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o produto: ${error.message}</span>`
                resultadoModal.show();
            });
    }
}

async function carregaProdutos() {
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' //Limpa a tabela antes de recarregar
    // Fazer a solicitação GET para o endpoint dos produtos
    await fetch(`${urlBase}/produtos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access-token": access_token //envia o token na requisição
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(produto => {
                tabela.innerHTML += `
                <tr>
                   <td>${produto.razao_social}</td>
                   <td>${produto.nome_fantasia}</td>
                   <td>${produto.cnae_fiscal}</td>
                   <td>${produto.data_inicio_atividade}</td>                   
                   <td>${produto.localizacao.coordinates[0]} / ${produto.localizacao.coordinates[1]}</td>        
                   <td>
                       <button class='btn btn-danger btn-sm' onclick='removeProduto("${produto._id}")'>🗑 Excluir </button>
                       <button class='btn btn-warning btn-sm' onclick='buscaProdutoPeloId("${produto._id}")'>📝 Editar </button>
                    </td>           
                </tr>
                `
            })
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o produto: ${error.message}</span>`
            resultadoModal.show();
        });
}

async function removeProduto(id) {
    if (confirm('Deseja realmente excluir o produto?')) {
        await fetch(`${urlBase}/produto/${id}`, {
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
                    carregaProdutos() // atualiza a UI
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o produto: ${error.message}</span>`
                resultadoModal.show();
            });
    }
}

async function buscaProdutoPeloId(id) {
    await fetch(`${urlBase}/produtos/id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "access-token": access_token //envia o token na requisição
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data[0]) { //Iremos pegar os dados e colocar no formulário.
                document.getElementById('id').value = data[0]._id
                document.getElementById('razao').value = data[0].razao_social
                document.getElementById('cnpj').value = data[0].cnpj
                document.getElementById('fantasia').value = data[0].nome_fantasia
                document.getElementById('cnae').value = data[0].cnae_fiscal
                document.getElementById('inicio').value = data[0].data_inicio_atividade
                document.getElementById('lat').value = data[0].localizacao.coordinates[0]
                document.getElementById('long').value = data[0].localizacao.coordinates[1]
            }
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar o produto: ${error.message}</span>`
            resultadoModal.show();
        });

}