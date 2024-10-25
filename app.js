const express = require('express');
const mysql = require('mysql'); // Import mysql

const app = express();
const port = 3306; // Define the port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com', // MySQL server address
    user: 'sql12740647', // MySQL username
    password: 'LZMZPav1Re', // MySQL password
    database: 'sql12740647', // Database name
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Database connection failed', err);
        return;
    }
    console.log('Connected to MySQL');

    app.post('/api/signup', (req, res) => {
        const {email, password,username } = req.body;

        // Hash the password before storing it
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password', err);
                return res.status(500).send('Internal Server Error');
            }

            // Insert the new user into the database
            const query = 'INSERT INTO STUDENT_LOGIN (EMAIL, PASSWORD,NAME) VALUES (? , ? , ?)';
            connection.query(query, [email, hashedPassword,username], (error, results) => {
                if (error) {
                    console.error('SQL error', error);
                    return res.status(500).send('Internal Server Error');
                }

                res.status(201).send('User registered successfully');
            });
        });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
