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

      res.status(201).send({ message: 'User registered successfully. Verification email sent.' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'An error occurred while registering the user.' });
  }
