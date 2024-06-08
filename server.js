import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.js'; // Import the user routes
import protectedRoutes from './routes/protected.js';
import emailRoutes from './routes/routes_email.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Connect to MongoDB
connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json()); // for parsing application/json
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/a', userRoutes);
app.use('/e', emailRoutes);
app.use('/p', protectedRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));