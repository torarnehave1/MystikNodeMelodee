import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.js'; // Import the user routes
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

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
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Routes
app.use('/a', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));