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
        channel.assertQueue(queue, {
            durable: false
        });
        channel.consume(queue, (msg)=>{
            console.log(msg.content.toString());
        })
    })
})
