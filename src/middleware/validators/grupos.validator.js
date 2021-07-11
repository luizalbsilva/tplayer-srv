module.exports = {
    validator: ({body: {nome}}, res, next) => {
        if (nome && nome.length > 3 && nome.length <= 100) {
            next()
        } else {
            res.statusCode = 400
            res.json({nome: 'Obrigatório. Deve conter entre 3 e 100 caracteres.'})
        }
    }
}