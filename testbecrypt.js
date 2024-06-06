import bcrypt from 'bcryptjs';

const plainTextPassword = 'Mandala1.';

// Generate a new hash
bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        if (err) throw err;
        console.log('New Hashed Password:', hash);

        // Use the newly generated hash to compare
        bcrypt.compare(plainTextPassword, hash, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
            } else {
                console.log('Password match:', result); // Should print: true
            }
        });
    });
});
