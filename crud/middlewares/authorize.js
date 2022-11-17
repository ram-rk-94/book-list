const amqp = require('amqplib/callback_api');
const authorize = async function(req, res, next) {
    const userEmail = req.body.email;

    amqp.connect(process.env.AMQP, (err, connection)=>{
        if(err) {
            throw err;
        }
        connection.createChannel((err, channel)=>{
            if(err) {
                throw err;
            }
            let sendingQueue = 'authorizeUser';
            let receivingQueue = 'authorization';
            channel.assertQueue(sendingQueue, {
                durable: false
            });
            channel.sendToQueue(sendingQueue, Buffer.from(userEmail));
            channel.assertQueue(receivingQueue, {
                durable: false
            });
            channel.consume(receivingQueue, (msg)=>{
                const message = msg.content.toString();
                if(message) {
                    next();
                }
                return res.status(401).send("Unzuthorized");
            })
            
        })
        connection.close();
    })
}

module.exports = {
    authorize: authorize
}