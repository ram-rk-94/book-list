const mongoose =  require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = require('../models/User');
const validation = require('../validation');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');

const register = async function (req, res) {
    let responseObj = new Object();
    
    try {
        //User input validated
        const validationResult = validation.Registerschema(req.body);
        if(validationResult.error) {
            responseObj.error = validationResult.error;
            responseObj.statusCode = 500;
            return res.send({responseObj});
        }

        //Check existing user
        const existingEmail = await userSchema.findOne({email: req.body.email});
        if(existingEmail){
            responseObj.statusCode = 500;
            responseObj.message = "Email already exists";
            return res.send({responseObj})
        }

        //Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);

        //Creating new user
        const user = new userSchema({
            name: req.body.name,
            email: req.body.email,
            password: hashedPwd,
            admin: req.body.admin
        });

        const registerUser = await user.save();
        responseObj.data = registerUser;
        responseObj.statusCode = 200;
        return res.send({responseObj});
    }
    catch(err) {
        console.log(err);
        responseObj.error = err;
        responseObj.statusCode = 500;
        return res.send({responseObj});
    }
}

const login = async function (req, res) {
    let responseObj = new Object();
    try {
        const validationResult = validation.Loginschema(req.body);
        if(validationResult.error) {
            responseObj.error = validationResult.error;
            responseObj.statusCode = 500;
            return res.send({responseObj});
        }

        //Check whether the account exists
        //Check existing user
        const user = await userSchema.findOne({email: req.body.email});
        if(!user){
            responseObj.statusCode = 500;
            responseObj.message = "Account does not exist. Pls signup";
            return res.send({responseObj})
        }

        // Password check
        const pwdValidation = await bcrypt.compare(req.body.password, user.password);
        if(!pwdValidation) {
            responseObj.statusCode = 500;
            responseObj.message = "Password doesn't match";
            return res.send({responseObj});
        }

        // Create and assign jwt on login
        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY);
        res.header('auth-token', token).send('Login sucess');

    } catch(err) {
        responseObj.statusCode = 500;
        responseObj.error = err;
        return res.send({responseObj});
    }
}

const verifyToken = async function() {
    let message;
    amqp.connect(process.env.AMQP, (err, connection)=>{
        if(err) {
            message.error = err;
            channel.sendToQueue(sendingQueue, Buffer.from(message));
        }
        console.log(channel);
        connection.createChannel((err, channel)=>{
            let receivingQueue = 'verifyToken';
            let sendingQueue = 'tokenVerification';

            channel.assertQueue(receivingQueue, {
                durable: false
            })

            channel.consume(receivingQueue, (token)=>{
                channel.assertQueue(sendingQueue, {
                    durable: false
                });
                try {
                    const verified = jwt.verify(token.content.toString(), process.env.SECRET_KEY);
                    channel.sendToQueue(sendingQueue, Buffer.from(verified));
                } catch (err) {
                    message.error = err;
                    channel.sendToQueue(sendingQueue, Buffer.from(message));
                }
                channel.close();
            })
            connection.close();
        })
        
    })
}

const authorize = async function() {
    let message;
    amqp.connect(process.env.AMQP, (err, connection)=>{
        if(err) {
            return res.status(500).send(err);
        }
        connection.createChannel((err, channel)=>{
            let receivingQueue = 'authorizeUser';
            let sendingQueue = 'authorization';

            channel.consume(receivingQueue, async (msg)=>{
                const userEmail = msg.content.toString();
                const user = await userSchema.findOne({email: req.body.email});
                let message;
                if(user.admin) {
                    message = true;
                    channel.assertQueue(sendingQueue, {
                        durable: false
                    });
                    channel.sendToQueue(sendingQueue, Buffer.from(message));
                } else {
                    message = false;
                    channel.sendToQueue(sendingQueue, Buffer.from(message));
                }
            })
        })
        connection.close();
    })
}

module.exports = {
    register: register,
    login: login,
    verifyToken: verifyToken,
    authorize: authorize
}