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
        console.error('Database connection failed');
        return;
    }
    console.log('Connected to MySQL');
});

// Sign-up route
app.post('/signup', (req, res) => {
    const { name, email, password, 'confirm-password': confirmPassword } = req.body; // Destructure to get confirmPassword
    console.log('Post request is hit');
    console.log('Received data :', req.body);
    
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



app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    // Query to find the user by email
    const query = 'SELECT * FROM STUDENT_LOGIN WHERE EMAIL = ?';
    connection.query(query, [email], (error, results) => {
        if (error) {
            console.error('SQL error', error);
            return res.status(500).send('Internal Server Error');
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords', err);
                return res.status(200).redirect('#');
            }

            if (isMatch) {
                res.status(200).redirect('#');
            } else {
                res.status(400).send('Invalid email or password');
            }
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
