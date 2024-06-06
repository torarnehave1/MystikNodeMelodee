try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
          console.log('User not found');
          return res.status(400).send('Invalid username or password.');
      }

      console.log('User found:', user);

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          console.log('Password does not match');
          return res.status(400).send('Invalid username or password.');
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error.');
  }