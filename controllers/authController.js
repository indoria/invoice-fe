import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';

const secret = process.env.JWT_SECRET || '';

export const register = async (req, res) => {
    try {
        const user = new User(req.body); // triggers pre-save middleware
        await user.save();
        res.status(201).json({ message: 'User created', secureHash: user.secureHash });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.json({ token });
};

export const getAnonymousToken = (req, res) => {
    const anonId = crypto.randomUUID();
    const token = jwt.sign({ anonId, role: 'anonymous' }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.json({ token });
};
