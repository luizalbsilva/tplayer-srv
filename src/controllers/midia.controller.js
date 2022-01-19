const { Midia } = require('../models')
const { midia_capitulos } = require('../models')
const { Capitulos } = require('../models')

const uploadMidia = async (request,response) => {

    const { nome, id_Streaming, small_description, time_duration, id_cap } = request.body

    try {

        const criaMidia = await Midia.create({
            nome,
            id_Streaming,
            small_description,
            time_duration
        })

        const id_midia = criaMidia.id_midia
        console.log(id_midia)
       
        const gravaMidiaLivroCap = await midia_capitulos.create({
            id_midia,
            id_cap
            
        })

        return response.status(201).send("Midia salva com sucesso!")
    
    } catch (err) {
        return response.status(500).send("Erro interno")
    }

}

const getLivroCapMidia = async (request,response) => {

    try {

        const findAll = await Capitulos.findAll({
            attributes: ['id_cap','num_cap','titulo_cap','desc_cap','id_livro'],
            include: [
                {
                    model: Midia,
                    attributes: ['id_midia', 'nome', 'id_Streaming','small_description','time_duration'],
                    through: {
                        attributes: []
                    }
                }
            ]
        })

        return response.status(200).send(findAll)

    } catch (err) {
        return response.status(500).send("Erro interno")
    }

}

const getMidiaCap = async (request,response) => {

    const { id_cap } = request.params
    
    try {

        const findMidias = await Capitulos.findOne({ where: {
            id_cap: id_cap
        },
            attributes: ['id_cap','num_cap','titulo_cap'],
            include: [
                {
                    model: Midia,
                    attributes: ['id_midia', 'nome', 'id_Streaming','small_description','time_duration'],
                    through: {
                        attributes: []
                    }
                }
            ]
        })

        const midiasCap = findMidias.Midia

        if (midiasCap.length == 0) {
            return response.status(404).send("Nenhuma mídia encontrada")
        }

        return response.status(200).send(findMidias)

    } catch (err) {
        return response.status(500).send("Erro interno")
    }

}

const deleteMidiaLivCap = async (request,response) => {

    const { id_midia, id_cap } = request.body

    try {

        const deletaMidiaLivCap = await midia_capitulos.destroy({ where: {
            id_midia: id_midia,
            id_cap: id_cap
        }}
        )

        const deleteMidia = await Midia.destroy({ where: {
            id_midia: id_midia
        }}
        )

        return response.status(200).send("Excluído com sucesso")
    
    } catch (err) {
        return response.status(500).send("Erro interno")
    }
}


const listagemMidias = async (request,response) => {

    try {
        
        const listaMidias = await Midia.findAll()

        if (listaMidias == null) {
            response.status(404).send("Nenhuma Midia encontrada")
        }

        response.status(200).send(listaMidias)
        
    } catch(err) {
        response.status(500).send("Erro ao listar as Midias")
    }

}

const listagemMidiasById = async (request,response) => {

    id = request.params.id

    try {

        const listagemMidias = await Midia.findByPk(id)

        if(!listagemMidias) {
            response.status(404).send(`Não foi encontrada mídia com o ID: ${id}`)
        } else {
            response.status(200).send(listagemMidias)
        }

    } catch(err) {
        response.status(500).send("Erro ao localizar mídia")
    }

}

module.exports = { uploadMidia, getLivroCapMidia, getMidiaCap, deleteMidiaLivCap, listagemMidias, listagemMidiasById };