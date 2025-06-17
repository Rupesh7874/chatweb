const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.split(" ")[1], 'chatdataapp');
        // console.log("jwtdata:", decoded);

        req.userId = decoded.userId;
        req.email = decoded.email
        next();
    } catch (error) {
        console.log(error); ''
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;