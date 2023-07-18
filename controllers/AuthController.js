const User = require('../models/User')

const bcrypt = require('bcryptjs') // para criptografar a senha


module.exports = class AuthController {

    static login (req, res){

        res.render('auth/login')
    }

    static register (req, res){

        res.render('auth/register')
    }

    static async registerPost (req,res){
        const {name, email, password, confirmpassword} = req.body

        // password match validation
        if(password != confirmpassword) {
            req.flash('message', 'As senhas não conferem!')
            res.render('auth/register')
            return
        }
        // check if user exists
        const checkIfUserExists = await User.findOne({where: {email:email}})
        if (checkIfUserExists) {
            req.flash('message', 'Esse e-mail já foi cadastrado!')
            res.render('auth/register')
            return
        }

        // create a password
        const salt =bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }
        // create an user
        try{
            const createdUser = await User.create(user)

            // initialize session
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado!')
            req.session.save(() => {
                res.redirect('/')
            })
            
        } catch (err){
            console.log(err)
        }
    }

    static async loginPost (req, res) {
        const {email, password } = req.body

        const user = await User.findOne({where: {email:email}})

        if(!user) {
            req.flash('message', 'O e-mail não está correto!')
            res.render('auth/login')
            return
        }

        // check if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message', 'A senha não está correta!')
            res.render('auth/login')
            return
        }
        
        // initialize session  
        req.session.userid = user.id

        req.flash('message', 'Login realizado!')
        req.session.save(() => {
            res.redirect('/')
        })
            
    }

    static logout (req,res) {
        req.session.destroy()
        res.redirect('/login')
    }
    
}
