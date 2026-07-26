const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { blacklistToken, isTokenBlacklisted } = require('../config/redis');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7*24*60*60*1000, //7 days
};

const generateTokens = (user) => {
    const payload = {_id: user._id, email: user.email, role: user.role};

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });

    return {accessToken, refreshToken};
};

const register = async (req, res, next) => {
    try {
        const {name, email, password} = req.validated.body;

        const existing = await User.findOne({email});
        if (existing) {
            return res.status(400).json({error: 'Email already registered'});
        }

        const password_hash = await bcrypt.hash(password, 12);
        const user = await User.create({name, email, password_hash});

        const {accessToken, refreshToken} = generateTokens(user);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        res.status(201).json({
            message: 'Registration successful',
            accessToken,
            user: {_id: user._id, name: user.name, email: user.email, role: user.role},
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const {email, password} = req.validated.body;
        
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const {accessToken, refreshToken} = generateTokens(user);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        res.json({
            message: 'Login successful',
            accessToken,
            user: {_id: user._id, name: user.name, email: user.email, role: user.role},
        });
    } catch (err) {
        next(err);
    }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }

    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(403).json({ error: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Rotate: blacklist the consumed token before issuing a new one
    const remainingTtl = decoded.exp - Math.floor(Date.now() / 1000);
    await blacklistToken(token, remainingTtl);

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json({ accessToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
    next(err);
  }
};

const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.exp) {
      const remainingTtl = decoded.exp - Math.floor(Date.now() / 1000);
      await blacklistToken(token, remainingTtl);
    }
  }
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, refresh, logout };