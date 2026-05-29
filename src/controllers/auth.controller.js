import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'benim_gizli_anahtarim_123'; 

export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User successfully registered!' });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists or invalid data.' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ error: 'User not found!' });

        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid password!' });

        
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.status(200).json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login.' });
    }
};