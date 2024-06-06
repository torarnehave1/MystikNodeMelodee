import bcrypt from 'bcrypt';

const plainTextPassword = 'Mandala1.';
const hashedPassword = '$2b$10$jGQdY9.ooI5KRlXmLBlX/usj7NPosBpqjplQg65On9sBUgnPus7wu';

bcrypt.compare(plainTextPassword, hashedPassword, (err, result) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        console.log('Password match:', result); // Should print: true
    }
});