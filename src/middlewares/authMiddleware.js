import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
    
  if (!authHeader) return res.status(401).json({ message: 'User not authenticated' });

  const token = authHeader.split(' ')[1]; // extract token after 'Bearer'
  
  jwt.verify(token, '123456', (err, decoded) => { // ← secret must match!
    if (err) return res.status(403).json({ message: 'Invalid token' });
    
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
