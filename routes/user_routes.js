// routes/auth.js
import express from 'express';
import User from '../models/User.js'; // Import the User model
import mongoose from 'mongoose';

const router = express.Router();



async function createUser(userData) {
    const user = new User(userData);
    try {
      await user.save();
      console.log('User saved successfully');
    } catch (err) {
      console.error('Error saving user: ', err);
    }
  }
  
  router.get('/register2', async (req, res) => {
    await createUser({
      _id: new mongoose.Types.ObjectId(),
      username: 'torarnehave@gmail.com',
      password: 'Mandala1.',
      dateOfBirth: new Date('1990-01-01'),
      createdAt: new Date(),
    });
    res.send('User registration completed');
  });

router.post('/register', async (req, res) => {
    
  //console.log(req.body); // Log the request body
  const { username, password } = req.body;
  
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Create a new user
    const user = new User({ username, password });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
  });

export default router;