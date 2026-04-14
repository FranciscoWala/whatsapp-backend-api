/*****************************************************************************
 * Projeto: Criar funções capaz de trabalhar em conjunto com arquivo .json 
 * de contatos para futuramente criar API.
 * Autor: Francisco Wala
 * Data:11/04/26
 * Versão:1.0
 *****************************************************************************/
const express = require('express')
const cors = require('cors')
const app = express()
const corsOptions = {
    origin: ['*'],
    methods: 'GET',
    allowedHeaders: ['Content-type', 'Authorization']
}

app.use(cors(corsOptions))

const contactFunctions = require('./module/funcoes.js')

app.get('/v1/senai/whatsapp/contatos', function (request, response) {
    let generalContacts = contactFunctions.getUserData()

    response.status(generalContacts.STATUS_CODE)
    response.json(generalContacts)
})

app.get('/v1/senai/whatsapp/dados/perfil/:phoneNumber', function (request, response) {
    let phoneNumber = request.params.phoneNumber
    let datasProfile = contactFunctions.getListDataProfile(phoneNumber)

    response.status(datasProfile.STATUS_CODE)
    response.json(datasProfile)
})

app.get('/v1/senai/whatsapp/dados/', function (request, response) {
    let phoneNumber = request.query.phoneNumber
    let nameUser = request.query.nameUser
    let contactUser = contactFunctions.getContactData(phoneNumber, nameUser)

    response.status(contactUser.STATUS_CODE)
    response.json(contactUser)
})

app.get('/v1/senai/whatsapp/dados/usuario/:id', function (request, response) {
    let idNumber = request.params.id
    let messagesById = contactFunctions.getMessageByUserId(idNumber)

    response.status(messagesById.STATUS_CODE)
    response.json(messagesById)
})

app.get('/v1/senai/whatsapp/dados/messages/', function (request, response) {
    let id = request.query.id
    let contactName = request.query.contactName

    let messagesBetweenIdContactName = contactFunctions.getListBetweenUserContact(id, contactName)

    response.status(messagesBetweenIdContactName.STATUS_CODE)
    response.json(messagesBetweenIdContactName)
})

app.get('/v1/senai/whatsapp/dados/palavra/mensagens/', function (request, response) {
    /*id, contactName, contactNumber, keyWord 
    2,"John Guttemberg",11966578996, "I'm")
    */
    let id = request.query.id
    let contactName = request.query.contactName
    let contactNumber = request.query.contactNumber
    let keyWord = request.query.keyWord

    let wordsFound = contactFunctions.getKeyWordByUser(id, contactName, contactNumber, keyWord)
    response.status(wordsFound.STATUS_CODE)
    response.json(wordsFound)
})

app.get('/v1/senai/whatsapp/help/', function (request, response) {
    let docAPI = {
        "api-Description": "Api para manipular dados de Whatsapp",
        "date": "2026/04/14",
        "development": "Francisco Wala",
        "version": "1.0",
        "endpoints": [
            {
                "router1": "/v1/senai/whatsapp/contatos",
                "description": "Listar todos os dados do arquivo .json"
            },
            {
                "router2": "/v1/senai/whatsapp/dados/perfil/11987876567",
                "description": "Listar dados de contatos por numero de usuário"
            },
            {
                "router3": "/v1/senai/whatsapp/dados/?phoneNumber=11987876567&nameUser=Jane Smith",
                "description": "Listar dados de por número de telefone e nome de contato"
            },
            {
                "router4": "/v1/senai/whatsapp/dados/usuario/1",
                "description": "Listar todas as mensagens de um usuário"
            },
            {
                "router5": "/v1/senai/whatsapp/dados/messages/?id=1&contactName=Mark Johnson",
                "description": "Listar mensagens entre usuário e contato do mesmo"
            },
            {
                "router6": "/v1/senai/whatsapp/dados/palavra/mensagens/?id=2&contactName=John Guttemberg&contactNumber=11966578996&keyWord=I'm",
                "description": "Listar conversas por palavra chave"
            }
        ]
    }
    response.status(200)
    response.json(docAPI)
})

app.listen(8080, function () {
    console.log('API aguardando novas requisições...')
})
