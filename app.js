const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure PostgreSQL connection
const pool = new Pool({
    host: 'dpg-csnih5ij1k6c73b426tg-a.oregon-postgres.render.com',
    user: 'mpdb_postgresql_user',
    password: 'KhnX13ABQQKqR8xmXjUc8MjKboifh0s6',
    database: 'mpdb_postgresql',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Disable SSL certificate verification
    }
});

pool.connect(err => {
    if (err) {
        console.error('Database connection failed', err);
        return;
    }
    console.log('Connected to PostgreSQL');
});

app.post('/signup', (req, res) => {
    const { name, email, password, 'confirm-password': confirmPassword } = req.body;
    console.log('Post request is hit');
    console.log('Received data:', req.body);

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password', err);
            return res.status(500).send('Internal Server Error');
        }

        const query = 'INSERT INTO STUDENT_LOGIN (NAME, EMAIL, PASSWORD) VALUES ($1, $2, $3)';
        pool.query(query, [name, email, hashedPassword], (error, results) => {
            if (error) {
                // Check for duplicate email error
                if (error.code === '23505') {
                    console.log('Email already in use');
                    return res.status(409).json({ error: 'Email already in use' });
                }
                console.error('SQL error', error);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Registration successful');
            res.redirect('/enterpercentile.html');
        });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const query = 'SELECT * FROM STUDENT_LOGIN WHERE EMAIL = $1';
    console.log('login request is hit..');
    
    pool.query(query, [email], (error, results) => {
        if (error) {
            console.error('SQL error', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = results.rows[0];
        
        // Convert bytea to string using encoding
        const hashedPassword = user.password.toString('utf-8'); 
        console.log('Database hashed password:', hashedPassword);
        console.log('Entered password:', password);
        
        // Compare with bcrypt
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords', err);
                return res.status(500).send('Internal Server Error');
            }

            if (isMatch) {
                res.status(200).redirect('/enterpercentile.html');
            } else {
                res.status(400).send('Invalid email or password');
            }
        });
    });
});


app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
