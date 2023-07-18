const { where } = require('sequelize')
const Toughts = require('../models/Tought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ToughtController {

    static async showToughts (req, res){

        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old') {
            order = 'ASC'
        } else{
            order = 'DESC'
        }


        const toughtsData = await Toughts.findAll({
            include: User,
            where : {
                title: {[Op.like] : `%${search}%`}
            },
            order : [['createdAt', order]]
        })
        
        const toughts = toughtsData.map((result) => result.get({plain : true}))

        let toughtsQty = toughts.length

        res.render('toughts/home', {toughts, search, toughtsQty})
    }
    
    static async dashboard (req,res) {
        const UserId = req.session.userid

        const user = await User.findOne({
            where: {id: UserId},
            include: Toughts,
            plain: true,
        
        })

        // check if user exists
        if(!user){
            res.redirect('/login')
        }

        const toughts = user.Toughts.map((result) => result.dataValues)

        // check if have not thoughts 
        let emptyToughts = false
        if(toughts.length === 0){
            emptyToughts = true
        }

        res.render('toughts/dashboard', {toughts , emptyToughts})
    }

    static createTought (req,res) {
        res.render('toughts/create')
    }

    static async createToughtPost (req,res) {
        const title = req.body.title
        const UserId = req.session.userid

        const tought = {
            title,
            UserId,
        }
         
        try{
            await Toughts.create(tought)

            req.flash('message', 'Pensamento criado com sucesso!')
            
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

        } catch (err) {
            console.log('Aconteceu o erro:' + err)
        }
    }

    static async removeTought (req,res) {
        const id = req.body.id

        try {
            await Toughts.destroy({where: {id:id, UserId: req.session.userid}})
            req.flash('message', 'Pensamento criado com sucesso!')
            
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

    
        } catch(err){
            console.log('Aconteceu eror:' + err)
        }
    }

    static async editTought (req,res) {
        const id = req.params.id

        const tought = await Toughts.findOne({where: {id:id}, raw:true })

        res.render('toughts/edit' , {tought})
    }

    static async editToughtPost (req,res) {
        const id = req.body.id
        const tought = {
            title : req.body.title,
        }

        try {
            await Toughts.update(tought, {where: {id:id}})
            req.flash('message', 'Pensamento editado com sucesso!')
            
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

    
        } catch(err){
            console.log('Aconteceu erro:' + err)
        }
    }

} 
