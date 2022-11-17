const amqp = require('amqplib/callback_api');

const authenticate = async function(req, res, next) {
    const authToken = req.header('auth-token');
    if(!authToken) {
        return res.status(401).send("Access Denied");
    }
    amqp.connect(process.env.AMQP, (err, connection)=>{
        if(err) {
            res.status(500).send(err);
        }
        connection.createChannel(async (err, channel)=>{
            if(err) {
                return res.status(500).send(err);
            }
            let sendingQueue = 'verifyToken';
            let receivingQueue = 'tokenVerification';

            channel.assertQueue(sendingQueue, {
                durable: false
            });
            await channel.sendToQueue(sendingQueue, Buffer.from(authToken));
            channel.assertQueue(receivingQueue, {
                durable: false
            });
            channel.consume(receivingQueue, (msg)=>{
                let message = msg.content.toString();
                if(message.error) {
                    return res.status(500).send(message.error);
                }
                next();
            })
        })
    })
}

module.exports = {
    authenticate: authenticate
}