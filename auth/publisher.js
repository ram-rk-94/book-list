const amqp = require('amqplib/callback_api');

amqp.connect(AMQP, (err, connection)=>{
    if(err) {
        throw err;
    }
    connection.createChannel((err, channel)=>{
        if(err) {
            throw err;
        }
        let queue = 'authentication';
        let msg = 'test';
        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));
    })
})
