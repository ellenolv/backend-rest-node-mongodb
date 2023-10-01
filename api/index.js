import  express  from "express";

const app = express()
const port = 4000 //poderia ser qualquer porta

app.use(express.json()) //Irá fazer o parse de arquivos JSON 
//Rotas de conteúdo público
app.use('/', express.static('public')) //Oq tiver nessa pasta será apenas renderizado e não processado
//Rotas da API
app.get('/api', (req, res) => {
    res.status(200).json({ //200 OK || 404 NOT FOUND
        message: 'API Fatec 100% funcional 🖐', //Mostrar que chegou na API 
        version: '1.0.0'
    })
})

app.listen(port, function(){
    console.log(`👑Servidor rodando na porta ${port}`)
})