import jwt from 'jsonwebtoken'

export default async function auth(req, res, next){
    const token = req.header('access-token') ||
                  req.headers['x-access-token'] 
    if(!token) return res.status(401).json({ //401 - Unauthorized
        mensagem: 'Acesso negado. É obrigatório o envio do token JWT'
    })              
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

       req.usuario = await decoded.usuario
       next() //direcionamos para o endpoint
    } catch (e){
        res.status(403).send({ error: `Token inválido: ${e.message}`})
        console.error(e.message)
    }
}