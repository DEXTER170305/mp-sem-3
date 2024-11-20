const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

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
                res.redirect('http://localhost:3000');
            } else {
                res.status(400).send('Invalid email or password');
            }
        });
    });
});

app.post('/enter-percentile', (req, res) => {
    const { exam, percentile, branch, category } = req.body;

    if (!exam || !percentile || !branch || !category) {
        return res.status(400).send('All fields are required');
    }

    // Process the data (You can save it to the database or perform other logic)
    console.log('Received data:', req.body);

    // Redirect to React app (localhost:3000)
    res.redirect('http://localhost:3000');
});

app.get('/get-colleges', (req, res) => {
    console.log("college data request hit");
    const query = `
        SELECT 
            COLLEGE.COLLEGE_NAME AS name, 
            COLLEGE.INSTITUTE_CODE AS institutionCode, 
            COLLEGE.NIRF_RANK AS nirfRank, 
            COLLEGE.CITY AS location, 
            COLLEGE.HOME_UNIVERSITY AS branch, 
            COLLEGE.STATUS AS status,
            COLLEGE.HOBBY AS hobby,
            CUTOFF.BRANCH AS branchName, 
            CUTOFF.OPEN AS cutoff
        FROM COLLEGE 
        LEFT JOIN CUTOFF ON COLLEGE.INSTITUTE_CODE = CUTOFF.INSTITUTE_CODE
    `;

    pool.query(query, (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching college data');
        }
        
        // Process the result to group branches and cutoffs by college
        const colleges = result.rows.reduce((acc, row) => {
            // Check if the college already exists in the accumulator
            let college = acc.find(c => c.institutionCode === row.institutionCode);
            if (!college) {
                // Create a new college entry if it doesn’t exist
                college = {
                    name: row.name,
                    institutionCode: row.institutionCode,
                    nirfRank: row.nirfRank,
                    location: row.location,
                    branch: row.branch,
                    status: row.status,
                    hobbies: row.hobby ? row.hobby.split(', ') : [],
                    branches: []
                };
                acc.push(college);
            }

            // Add branch and cutoff information
            college.branches.push({
                name: row.branchName,
                cutoff: row.cutoff
            });

            return acc;
        }, []);

        res.json(colleges); // Send the formatted data back to the client
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
