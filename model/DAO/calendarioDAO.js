/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados que irão para o calendário no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllEventosByPacienteMonthly = async function (idPaciente, mes) {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

const selectAllEventosByCuidadorMonthly = async function (idCuidador, mes) {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByPacienteDiary = async function (dadosCalendario) {

    //scriptSQL para buscar todos os itens do BD
    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_evento.dia = '${dadosCalendario.dia}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_dia_semana.dia = '${dadosCalendario.dia}' and tbl_dia_evento.status = 1;`

    let sqlAlarme = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_alarme_unico.id as id_alarme_unitario, TIME_FORMAT(tbl_alarme_unico.horario, '%H:%i') as horario_alarme_unitario, tbl_alarme_unico.dia as dia_criacao_alarme_unico,
		   tbl_status_alarme.id as id_status_alarme, tbl_status_alarme.nome as status_alarme,
		   tbl_alarme_medicamento.id as id_alarme, tbl_alarme_medicamento.intervalo as intervalo_alarme,
		   tbl_medicamento.id as id_medicamento, tbl_medicamento.nome as medicamento
	from tbl_paciente
		left join tbl_medicamento
	on tbl_paciente.id = tbl_medicamento.id_paciente
		left join tbl_alarme_medicamento
	on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		left join tbl_alarme_unitario_status as tbl_alarme_unico
	on tbl_alarme_unico.id_alarme_medicamento = tbl_alarme_medicamento.id
		left join tbl_status_alarme
	on tbl_status_alarme.id = tbl_alarme_unico.id_status_alarme
    WHERE tbl_paciente.id = ${dadosCalendario.id_paciente} AND 
    (
		tbl_alarme_unico.dia IS NOT NULL AND 
		(
			DATE_FORMAT(DATE_ADD(CONCAT(tbl_alarme_unico.dia, ' ', tbl_alarme_unico.horario), INTERVAL (tbl_alarme_medicamento.intervalo / 1000) SECOND), '%Y-%m-%d') = '${dadosCalendario.dia}'
		)
	);`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsAlarme = await prisma.$queryRawUnsafe(sqlAlarme)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico.length > 0 && rsEvento_semanal.length > 0 && rsAlarme.length > 0) {
        let calendarioJSON = {}
        let eventosUnicos = []
        let eventosSemanais = []
        let alarmes = []

        rsEvento_unico.forEach(evento => {
            let eventoJSON = {}

            eventoJSON.id = evento.id_evento
            eventoJSON.id_paciente = evento.id_paciente
            eventoJSON.paciente = evento.paciente
            eventoJSON.id_cuidador = evento.id_cuidador
            eventoJSON.cuidador = evento.cuidador
            eventoJSON.nome = evento.nome_evento_unico
            eventoJSON.descricao = evento.descricao_evento_unico
            eventoJSON.local = evento.local_evento_unico
            eventoJSON.dia = evento.dia_evento_unico
            eventoJSON.horario = evento.horario_evento_unico
            eventoJSON.cor = evento.cor

            eventosUnicos.push(eventoJSON)
        });

        rsEvento_semanal.forEach(evento => {
            let eventoJSON = {}

            eventoJSON.id = evento.id_evento_semanal
            eventoJSON.id_paciente = evento.id_paciente
            eventoJSON.paciente = evento.paciente
            eventoJSON.id_cuidador = evento.id_cuidador
            eventoJSON.cuidador = evento.cuidador
            eventoJSON.nome = evento.nome_evento_semanal
            eventoJSON.descricao = evento.descricao_evento_semanal
            eventoJSON.local = evento.local_evento_semanal
            eventoJSON.horario = evento.horario_evento_semanal
            eventoJSON.cor = evento.cor

            eventosSemanais.push(eventoJSON)
        })

        rsAlarme.forEach(alarme => {
            let alarmeJSON = {}

            alarmeJSON.id = alarme.id_alarme_unitario
            alarmeJSON.id_paciente = alarme.id_paciente
            alarmeJSON.paciente = alarme.paciente
            alarmeJSON.medicamento = alarme.medicamento
            alarmeJSON.horario = alarme.horario_alarme_unitario
        })

        return rsSintoma
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByCuidadorDiary = async function (idCuidador, dia) {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

module.exports = {
    selectAllEventosAndAlarmesByCuidadorDiary,
    selectAllEventosAndAlarmesByPacienteDiary,
    selectAllEventosByCuidadorMonthly,
    selectAllEventosByPacienteMonthly
}
