const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', 'Gui080092', {
    host:'localhost',
    dialect:'mysql',
})

try{
    sequelize.authenticate()
    console.log('Conectado ao mysql')

}catch (error){
    console.log(`Erro ${error}`)
}
module.exports = sequelize
