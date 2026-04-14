/*****************************************************************************
 * Projeto: Criar funções capaz de trabalhar em conjunto com arquivo .json 
 * de contatos para futuramente criar API.
 * Autor: Francisco Wala
 * Data:08/04/26
 * Versão:1.0
 *****************************************************************************/

const contatosWhatsapp = require('./contatos')
const contatos = contatosWhatsapp.contatos
const ERROR_NOT_FOUND = { STATUS: false, STATUS_CODE: 404, DESENVOLVEDOR: 'Francisco_Wala' }

/*
Listar todos os dados de usuário independente do número  
(Retornar todos os dados)
*/
//'whats-users'
function getUserData() {

    let listUsers = { STATUS: true, STATUS_CODE: 200, DESENVOLVEDOR: 'Francisco_Wala', users: [] }

    contatos['whats-users'].forEach(function (itemUserList) {

        listUsers.users.push(
            {
                id: itemUserList.id,
                account: itemUserList.account,
                nickname: itemUserList.nickname,
                number: itemUserList.number,
                image_user: itemUserList['profile-image'],
                create_since_start: itemUserList['created-since'].start,
                create_since_end: itemUserList['created-since'].end,
                background: itemUserList.background,
                contacts: itemUserList.contacts.map(function (userContact) {
                    return {
                        name: userContact.name,
                        description: userContact.description,
                        image: userContact.image,
                        messages: userContact.messages.map(function (userMessages) {
                            return {
                                sender: userMessages.sender,
                                content: userMessages.content,
                                time: userMessages.time
                            }
                        })
                    }
                })
            }
        )

    })

    if (listUsers.users.length > 0) {
        return listUsers
    }else{
        return ERROR_NOT_FOUND
    }

}
// console.log(getUserData())
/**
    Listar dados da conta do profile do usuário  
    (Todos os dados do profile que podem ser alterados como nome,“nick”, 
    foto, número, imagem, cor de fundo e dados da conta como criação e 
    encerramento,  etc)
 */
function getListDataProfile(contactNumber) {
    let answer = { STATUS: true, STATUS_CODE: 200, DESENVOLVEDOR: 'Francisco_Wala', user: [] }
    const userDatas = getUserData()
    userDatas.users.forEach(function (userInfo) {
        if (userInfo.number == contactNumber) {
            answer.user.push(userInfo)
        }
    })
    if (answer.user.length > 0) {
        return answer
    }else{
        return ERROR_NOT_FOUND
    }
    
}
// console.log(getListDataProfile('11987876567'))

/**
 * Listar dados de contato para cada usuário  
(Retornar apenas os dados pessoais de cada contato do usuário, como 
nome, foto e descrição)
 */
function getContactData(phoneNumber, nameUser) {
    let answer = { STATUS: true, STATUS_CODE: 200, DESENVOLVEDOR: 'Francisco_Wala', datas: [] }

    const userDatas = getListDataProfile(phoneNumber)
    userDatas.user.forEach(function (dataUser) {
        //Verificando o retorno de dataUser
        // console.log(dataUser)
        dataUser.contacts.forEach(function (contactFound) {
            if (contactFound.name == nameUser) {
                answer.datas.push(
                    {
                        name: contactFound.name,
                        photo: contactFound.image,
                        description: contactFound.description
                    }
                )
            }
        })

    })
    if (answer.datas.length > 0) {
        return answer
    }
    return ERROR_NOT_FOUND
}
// console.log(getContactData('11987876567','Jane Smith'))

/**
 *  Listar todas as mensagens trocadas de uma conta de usuário   
    (Retornar todos os dados) 
 */
function getMessageByUserId(id) {

    let answer = { STATUS: true, STATUS_CODE: 200, DESENVOLVEDOR: 'Francisco_Wala', dataMessage: [] }


    contatos['whats-users'].forEach(function (itemUser) {
        // console.log(itemUser.id)
        if (id == itemUser.id) {
            // console.log(itemUser.contacts)
            itemUser.contacts.forEach(function (contact) {
                // console.log(contact.messages)
                contact.messages.forEach(function (messages) {
                    answer.dataMessage.push(
                        {
                            // sender:messages.sender,
                            // content:messages.content,
                            // time:messages.time
                            ...messages
                        }
                    )

                })

            })

        }
    })
    if (answer.dataMessage.length > 0) {
        return answer
    }else{
        return ERROR_NOT_FOUND
    }
}
// console.log(getMessageByUserId('1'))

/**
 *  Listar uma conversa de um usuário e um contato 
    (Retornar dados como: nome, número de celular e as 
    conversas). Deve obrigatoriamente encaminhar a referência 
    para encontrar a conversa  via Query e não via parâmetro) 
 */
function getListBetweenUserContact(id, contactName) {

    let answer = {
        STATUS: true, STATUS_CODE: 200, DESENVOLVEDOR: 'Francisco_Wala',
        dataRelation: {
            name: '',
            phoneNumber: '',
            messages: []
        }
    }

    contatos['whats-users'].forEach(function (itemUser) {
        if (id == itemUser.id) {
            answer.dataRelation.name = itemUser.account
            answer.dataRelation.phoneNumber = itemUser.number
            itemUser.contacts.forEach(function (itemUserContact) {
                if (itemUserContact.name == contactName) {
                    // answer.dataRelation.push(itemUserContact.messages)
                    itemUserContact.messages.forEach(function (itemMessagesFound) {
                        answer.dataRelation.messages.push(
                            {
                                ...itemMessagesFound
                            }
                        )
                    })
                }
                // console.log(itemUserContact.messages)
            })
        }

    })
    if (answer.dataRelation.messages.length > 0) {
        return answer
    }else{
        return ERROR_NOT_FOUND
    }
}
// console.log(getListBetweenUserContact('1', 'Mark Johnson'))

function getKeyWordByUser(id, contactName, contactNumber, keyWord) {
    let answer = {
        STATUS: true, STATUS_CODE: 200, DESENVOLVEDOR: 'Francisco_Wala',
        dataRelation: {
            name: contactName,
            phoneNumber: contactNumber,
            keyWord,
            messages: []
        }
    }
    contatos['whats-users'].forEach(function (itemId) {
        if (id == itemId.id && contactNumber == itemId.number) {
            itemId.contacts.forEach(function (itemContact) {
                if (contactName == itemContact.name) {
                    let resultFromSearch = itemContact.messages.filter(item =>
                        item.content.toUpperCase().includes(keyWord.toUpperCase())
                    )
                    answer.dataRelation.messages = resultFromSearch
                }
            })
        }
    })
    if( answer.dataRelation.messages.length>0 ){
        return answer
    }else{
        return ERROR_NOT_FOUND
    }
}

// TESTES com mais de uma palavra em contents diferentes
// console.log(getKeyWordByUser(1,11987876567,"Ana Maria","Hello"))
// console.log(getKeyWordByUser(2,"John Guttemberg",11966578996, "I'm"))
module.exports = {
    getUserData,
    getListDataProfile,
    getContactData,
    getMessageByUserId,
    getListBetweenUserContact,
    getKeyWordByUser
}