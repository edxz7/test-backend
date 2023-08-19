const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model')

exports.signupController = async (req, res, next) => {

    try {
    const { email, name, password} = req.body;

    // Revisamos si el email, password o name no son strings vacios
    if(email === '' || name === '' || password === '') {
        res.status(400).json({ message: "The fields name, password and name are required" })
        return
    }

    // validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!emailRegex.test(email)) {
        res.status(400).json({ message: "The email format is not valid" })
        return
    } 

    // validar que el password: tenga al menos 6 caracteres y use mayusculas y minusculas
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!passwordRegex.test(password)) {
        res.status(400).json({ message: `
            The pass should have at least 6 characters, at least one number, 
            one uppercase and one lowercase letter
        ` })
        return
    } 


        // revisamos que el user no este ya registrado
        const user = await User.findOne({ email })
        if(user) {
           res.status(400).json({ message: "This email is already taken" }) 
           return
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ email, name, password: hashedPassword })
        const { email: savedEmail, name: savedName, _id } = createdUser;

        res.status(201).json({ user: { email: savedEmail, name: savedName, _id } })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.loginController = async (req, res, next) => {
    try {
        const  { password, email } = req.body;
        // Revisamos si el email o password no son strings vacios
        if(email === '' || password === '') {
            res.status(400).json({ message: "The fields name and password are required" })
            return
        }

        // revisamos que el usuario realmente exista en nuestra DB
        const foundUser = await User.findOne({ email })
        if(!foundUser) {
            res.status(401).json({ message: "User not found" })
            return 
        }

        const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password)

        if(isPasswordCorrect) {
            // Vamos a crear y a firmar un JWT el cual le entregaremos al front
            // este token va a tener un periodo de vida antes de expirar
            // y mientras el front nos envie requests que tenagan a este token
            // para el server el usuario estara autenticado

            const authToken = jwt.sign(
                { _id: foundUser._id, email: foundUser.email, name: foundUser.name }, // payload
                process.env.SECRET_KEY,                       // secret key
                { algorithm: 'HS256', expiresIn: '1h' }       // header
            )

            res.status(200).json ({ authToken  })
        }


    } catch (error) {
        
    }

}


exports.verifyController = async (req, res, next) => {
    // verifyController se ejecuta si el request tenia un token valido
    // eso hace que el middleware isAuthenticated, de-codifique el token
    // y guarde el resultado en un objeto llamado payload el cual es agregado
    // al objeto request
    console.log('req.payload: ', req.payload)
    res.status(200).json(req.payload)

}



// module.exports = {
//     signupController,
//     loginController,
//     verifyController
// } 


