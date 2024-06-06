// routes/auth.js
import express from 'express';
import User from '../models/User.js'; // Import the User model
import mongoose from 'mongoose';
import crypto from 'crypto';
import emailTemplates from '../public/languages/nb.json' assert { type: 'json' };
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with your secret key

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
    const token = crypto.randomBytes(20).toString('hex');
    await createUser({
        _id: new mongoose.Types.ObjectId(),
        username: 'torarnehave@gmail.com',
        password: await bcrypt.hash('Mandala1.', 10), // Hash the password
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        emailVerificationToken: token,
        emailVerificationTokenExpires: Date.now() + 3600000,
    });
    res.send('User registration completed');
});

router.post('/registerbak', async (req, res) => {
    const { username, password } = req.body;
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const emailVerificationTokenExpires = Date.now() + 3600000;

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword, emailVerificationToken, emailVerificationTokenExpires });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  const emailVerificationTokenExpires = Date.now() + 3600000;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'A user with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('New Hashed Password:', hashedPassword);

      // Compare the plain text password with the hashed password to ensure correctness
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
          console.error('Error comparing passwords: Passwords do not match');
          return res.status(500).json({ message: 'Error hashing password' });
      } else {
          console.log('Password match:', isMatch); // Should print: true
      }

      const user = new User({
          username,
          password: hashedPassword,
          emailVerificationToken,
          emailVerificationTokenExpires
      });

      await user.save();
      console.log('User saved successfully');

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: 'slowyou.net@gmail.com',
              pass: 'thuo hsxf fpco xgxt',
          },
      });

      const mailOptions = {
          from: 'slowyou.net@gmail.com',
          to: user.username,
          subject: emailTemplates.email.verification.subject,
          text: emailTemplates.email.verification.body.replace('{verificationLink}', `http://localhost:5000/a/verify-email?token=${emailVerificationToken}`)
      };

      try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: ' + info.response);
      } catch (mailError) {
          console.error('Error sending email:', mailError);
      }

      res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
});


router.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    try {
        // Find a user with the verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }

        // Mark the user as verified
        //user.emailVerificationToken = null;
        //user.emailVerificationTokenExpires = null;
        user.isVerified = true;

        // Save the user
        await user.save();

        //res.send('Your account has been verified.');
        res.redirect('../login.html',);  

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        console.log('User not found');
        return res.status(400).send('Invalid username or password.');
      }
  
      console.log('User found:', user);
  
      // Check if the user's email has been verified
      if (!user.isVerified) {
        console.log('User email not verified');
        return res.status(400).send('Please verify your email before logging in.');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      console.log('Comparing passwords:', {
        plainText: password,
        hashed: user.password,
        isMatch
      });
  
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).send('Invalid username or password.');
      }
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
      // Set the token as a cookie
      res.cookie('jwtToken', token, { httpOnly: true });
  
      // Send a redirect response
      res.status(200).json({ message: 'Login successful', redirectUrl: '/index.html' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error.');
    }
  });
  
  
export default router;
