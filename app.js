const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // Import bcrypt
const app = express();
const port = 3000; // Server port (not MySQL port)

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12740647',
    password: 'LZMZPav1Re',
    database: 'sql12740647',
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
    const { username, email, password } = req.body;

    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password', err);
            return res.status(500).send('Internal Server Error');
        }

        // Insert the new user into the database
        const query = 'INSERT INTO STUDENT_LOGIN (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)';
        connection.query(query, [username, email, hashedPassword], (error, results) => {
            if (error) {
                console.error('SQL error', error);
                return res.status(500).send('Internal Server Error');
            }
            console.log('registration successful');
            res.status(201).send('User registered successfully');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
