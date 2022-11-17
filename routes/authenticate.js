const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const token = req.headers('auth-token');
    if(!token) {
        return res.status(401).send("Access Denied");
    }
    
    try{
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
    } catch(err) {
        return res.status(403).send(err);
    }
}