/* API REST dos produtos */
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import {check, validationResult} from 'express-validator'

const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'produtos'
const validaProduto = [
    check('codigo_produto')
    .not().isEmpty().trim().withMessage('É obrigatório informar o código do produto')
    .isNumeric().withMessage('O código do produto deve ser um número'),
  check('nome_produto')
    .not().isEmpty().trim().withMessage('É obrigatório informar o nome do produto')
    .isLength({ min: 5 }).withMessage('O nome do produto deve ter no mínimo 5 caracteres')
    .isLength({ max: 200 }).withMessage('O nome do produto não deve exceder 200 caracteres'),
  check('descricao')
    .not().isEmpty().trim().withMessage('É obrigatório informar a descrição do produto'),
  check('data_validade')
    .not().isEmpty().trim().withMessage('É obrigatório informar a data de validade'),
  check('preco_unitario')
    .not().isEmpty().trim().withMessage('É obrigatório informar o preço unitário')
    .isNumeric().withMessage('O preço unitário deve ser um número'),
  check('quantidade_em_estoque')
    .not().isEmpty().trim().withMessage('É obrigatório informar a quantidade em estoque')
    .isNumeric().withMessage('A quantidade em estoque deve ser um número'),
]
/**
 * GET /api/produtos
 * Lista todos os produtos de serviço
 */
router.get('/', async(req, res) => {
    try{
        db.collection(nomeCollection).find().sort({nome_produto: 1}).toArray((err, docs) => {
            if(!err){
                res.status(200).json(docs)
            }
        })
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a listagem dos produtos',
                param: '/'
            }]
        })
    }
})

/**
 * GET /api/produtos/id/:id
 * Lista todos os produtos 
 */
router.get('/id/:id', async(req, res)=> {
    try{
        db.collection(nomeCollection).find({'_id': {$eq: ObjectId(req.params.id)}})
        .toArray((err, docs) => {
            if(err){
                res.status(400).json(err) // bad request
            } else {
                res.status(200).json(docs) // retorna o documento
            }
        })
    } catch (err) {
        res.status(500).json({"error": err.message})
    }
})

/**
 * GET /api/prestadores/nome/:nome
 * Lista os produtos pelo nome
 */
router.get('/nome/:nome', async(req, res)=> {
    try{
        db.collection(nomeCollection)
        .find({'nome_produto': {$regex: req.params.nome, $options: "i"}})
        .toArray((err, docs) => {
            if(err){
                res.status(400).json(err) // bad request
            } else {
                res.status(200).json(docs) // retorna o documento
            }
        })
    } catch (err) {
        res.status(500).json({"error": err.message})
    }
})

/**
 * DELETE /api/prestadores/:id
 * Apaga o produto pelo id
 */

router.delete('/:id', async(req, res) => {
    await db.collection(nomeCollection)
    .deleteOne({"_id": { $eq: ObjectId(req.params.id)}})
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).json(err))
})

/**
 * POST /api/produtos
 * Insere um novo produto 
 */
router.post('/', validaProduto, async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
})

/**
 * PUT /api/produto
 * Altera um produto
 */
router.put('/', validaProduto, async(req, res) => {
    let idDocumento = req.body._id //armazenando o id do documento
    delete req.body._id //iremos remover o id do body
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
        .updateOne({'_id': {$eq : ObjectId(idDocumento)}},
                   { $set: req.body})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
})
export default router