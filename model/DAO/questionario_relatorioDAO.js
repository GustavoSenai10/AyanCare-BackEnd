/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Questionario no Banco de Dados.
 * Data: 11/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/********************Selects************************** */
const selectAllQuestionario = async function () {
    let sql = `Select tbl_questionario.id as id, tbl_questionario.resposta as resposta,tbl_questionario.id_relatorio as id_relatorio,
        tbl_pergunta.pergunta as pergunta
    from tbl_questionario
    inner join tbl_pergunta
    on tbl_questionario.id_pergunta = tbl_pergunta.id`

    let rsQuestionario = await prisma.$queryRawUnsafe(sql)

    if (rsQuestionario.length > 0) {
        let questionarios = []


        rsQuestionario.forEach(resposta => {
            let questionarioJSON = {}

            questionarioJSON.id = resposta.id
            questionarioJSON.pergunta = resposta.pergunta

            if (resposta.resposta === 1) {
                questionarioJSON.resposta = true
            } else {
                questionarioJSON.resposta = false
            }

            questionarioJSON.id_relatorio = resposta.id_relatorio

            questionarios.push(questionarioJSON)
        });

        return questionarios
    } else {
        return false
    }
}

const selectQuestionarioByID = async function (idQuestionario) {

    let sql = `Select tbl_questionario.id as id, tbl_questionario.resposta as resposta,tbl_questionario.id_relatorio as id_relatorio,
    tbl_pergunta.pergunta as pergunta
    from tbl_questionario
        inner join tbl_pergunta
    on tbl_questionario.id_pergunta = tbl_pergunta.id
    where tbl_questionario.id = ${idQuestionario}`

    let rsQuestionario = await prisma.$queryRawUnsafe(sql)

    if (rsQuestionario.length > 0) {

        let questionarioJSON = {}
        questionarioJSON.id = rsQuestionario[0].id
        questionarioJSON.pergunta = rsQuestionario[0].pergunta

        if (rsQuestionario[0].resposta === 1) {
            questionarioJSON.resposta = true
        } else {
            questionarioJSON.resposta = false
        }

        questionarioJSON.id_relatorio = rsQuestionario[0].id_relatorio
        
        return questionarioJSON
    } else {
        return false
    }

}

const selectQuestionarioByRelatorio = async function (idRelatorio) {

    let sql = `Select tbl_questionario.id as id, tbl_questionario.resposta as resposta,tbl_questionario.id_relatorio as id_relatorio,
    tbl_pergunta.pergunta as pergunta
    from tbl_questionario
        inner join tbl_pergunta
    on tbl_questionario.id_pergunta = tbl_pergunta.id
        inner join tbl_relatorio
    on tbl_relatorio.id = tbl_questionario.id_relatorio
    where tbl_relatorio.id = ${idRelatorio}`

    let rsQuestionario = await prisma.$queryRawUnsafe(sql)

    if (rsQuestionario.length > 0) {
        let questionarios = []
        rsQuestionario.forEach(resposta => {
            let questionarioJSON = {}

            questionarioJSON.id = resposta.id
            questionarioJSON.pergunta = resposta.pergunta

            if (resposta.resposta === 1) {
                questionarioJSON.resposta = true
            } else {
                questionarioJSON.resposta = false
            }

            questionarioJSON.id_relatorio = resposta.id_relatorio

            questionarios.push(questionarioJSON)
        });

        return questionarios
    } else {
        return false
    }

}

const selectLastId = async function () {

    let sql = `Select tbl_questionario.id as id, tbl_questionario.resposta as resposta,tbl_questionario.id_relatorio as id_relatorio,
    tbl_pergunta.pergunta as pergunta
    from tbl_questionario
        inner join tbl_pergunta
    on tbl_questionario.id_pergunta = tbl_pergunta.id
    order by id desc limit 1`

    let rsQuestionario = await prisma.$queryRawUnsafe(sql)

    if (rsQuestionario.length > 0) {

        let questionarioJSON = {}
        questionarioJSON.id = rsQuestionario[0].id
        questionarioJSON.pergunta = rsQuestionario[0].pergunta

        if (rsQuestionario[0].resposta === 1) {
            questionarioJSON.resposta = true
        } else {
            questionarioJSON.resposta = false
        }

        questionarioJSON.id_relatorio = rsQuestionario[0].id_relatorio
        
        return questionarioJSON
    } else {
        return false
    }

}
/**************************Inserts******************************/
const insertQuestionario = async function (dadosQuestionario) {

    let sql = `insert into tbl_questionario(
        id_pergunta,
        resposta,
        id_relatorio
    ) values (
        ${dadosQuestionario.id_pergunta},
        ${dadosQuestionario.resposta},
        ${dadosQuestionario.id_relatorio}
    )`


    let resultQuestionario = await prisma.$executeRawUnsafe(sql)

    if (resultQuestionario) {
        return true
    } else {
        return false
    }
}



module.exports = {
    selectAllQuestionario,
    selectQuestionarioByID,
    selectLastId,
    insertQuestionario,
    selectQuestionarioByRelatorio
}