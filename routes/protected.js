import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import User from '../models/User.js'; // Import the User model

const app = express();
app.use(cookieParser());

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        console.error(ex);
        res.status(500).send('An error occurred while authenticating.');
    }
}

// Protected route
router.get('/protected', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username');
        res.send(`You are authenticated as ${user.username}`);
    } catch (ex) {
        console.error(ex);
        res.status(500).send('An error occurred while processing your request.');
    }
});

export default router;

