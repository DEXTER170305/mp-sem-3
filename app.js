const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // Import bcrypt
const app = express();
const port = 3000; // Server port

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12740647',
    password: 'LZMZPav1Re',
    database: 'sql12740647',
    port: 3306,
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Database connection failed', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Sign-up route
app.post('/signup', (req, res) => {
    const { name, email, password, 'confirm-password': confirmPassword } = req.body; // Destructure to get confirmPassword
    console.log('Post request is hit');
    console.log('Received data:', req.body);
    
    // Validate all fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password', err);
            return res.status(500).send('Internal Server Error');
        }

        // Insert the new user into the database
        const query = 'INSERT INTO STUDENT_LOGIN (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)';
        connection.query(query, [name, email, hashedPassword], (error, results) => {
            if (error) {
                console.error('SQL error', error);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Registration successful');
            res.status(201).send('User registered successfully');
        });
    });
});

// Serve static files (optional)
app.use(express.static('public')); // Assuming your HTML file is in a folder named 'public'

// Adjust path as needed

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
