// routes/auth.js
import express from 'express';
import User from '../models/User.js'; // Import the User model
import mongoose from 'mongoose';
import crypto from 'crypto';
import emailTemplates from '../public/languages/nb.json' assert { type: 'json' };
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config()


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Replace with your secret key

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
  const { fullName, username, password } = req.body;
  console.log(req.body);

  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  const emailVerificationTokenExpires = Date.now() + 3600000;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).send({ message: 'A user with this email already exists.' });
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
          fullName: fullName,
        username: username,
          password: hashedPassword,
          emailVerificationToken,
          emailVerificationTokenExpires
      });

      await user.save();
      console.log('User saved successfully');

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
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

      res.status(201).send({ message: `User registered successfully. Verification email sent to:${username}`});
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'An error occurred while registering the user.' });
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
       
        // Set the token as a cookie with SameSite attribute
        res.cookie('jwtToken', token, {
            httpOnly: false,
            sameSite: 'Strict', // or 'Lax' or 'Strict', based on your needs
            secure: false // make sure to use HTTPS
        });

        // Send a redirect response
        res.status(200).json({ message: 'Login successful', redirectUrl: '/index.html' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});
  

router.get('/forgot', async (req, res) => {
    const { email } = req.query;

    try {
        // Find the user by email
        const user = await User.findOne({ username :email });
        if (!user) {
            return res.status(400).send('User with this email does not exist.');
        }

        // Check if the user's email is verified
        if (!user.isVerified) {
            return res.status(400).send('Email is not verified.');
        }

        // Generate a password reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Associate the token with the user in your database
        user.emailVerificationToken = token;
        await user.save({ validateBeforeSave: false });

        // Send an email to the user with the password reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.username,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://localhost:5000/a/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('There was an error sending the recovery email:', err);
                res.status(500).send('An error occurred while sending the recovery email.');
            } else {
                console.log('Recovery email sent successfully');
                res.status(200).send('Recovery email sent to you email, please check your inbox or spam folder. The recovery email is sent from slowyou.net@gmail.com');
            }
        });
    } catch (error) {
        console.error('An error occurred while processing the request:', error);
        res.status(500).send('An error occurred while processing your request.');
    }


});

router.get('/reset-password/:token', async (req, res) => {
    try {
        console.log(req.params.token);
        const user = await User.findOne({ emailVerificationToken: req.params.token });
      
        
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Render reset password view
        res.render('reset', { token: req.params.token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});




router.post('/save-new-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({ emailVerificationToken: token });


        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password and save it to the user
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send('Your password has been updated.');
        //res.redirect('../login.html',);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

export default router;
