import bcrypt from 'bcrypt';

const plainTextPassword = 'Mandala1.';

bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        if (err) throw err;
        console.log('Hashed Password:', hash);
    });
});
