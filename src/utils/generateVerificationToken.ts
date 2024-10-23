var jwt = require('jsonwebtoken');

// Function to generate a JWT verification token with an expiration time of one hour

export function generateVerificationToken(email: string) {
    // Generate a JWT token with the email as payload and expiration time of 1 hour
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
}

