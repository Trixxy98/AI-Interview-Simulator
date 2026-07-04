const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    if (!token) {
        return res.status(401).json({error: 'Acess token required'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({error: 'Invalid or expired token'});
    }
};

const requireRole = (roles) => (req, res, next) =>{
    if (!roles.includes(req.user?.role)){
        return res.status(403).json({error: 'Forbidden: Insufficient permissions'});
    }
    next();
};

const resourceOwner = (getResourceUserId) => async (req,res,next) => {
    try {
        const resourceUserId = await getResourceUserId(req);
        if (String(resourceUserId) !== String(req.user?.id)){
            return res.status(403).json({error: 'Forbidden: not resource owner'});
        }
        next();
    }catch (err) {
        next(err);
    }
}

module.exports = {verifyToken, requireRole, resourceOwner};