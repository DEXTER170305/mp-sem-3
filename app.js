const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());

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

app.get('/get-colleges', async (req, res) => {
    console.log('Query received:', req.query);
    try {
        // Extract filters from the query parameters
        const { branch, hobbies } = req.query;

        // Start building the base SQL query
        let query = `
            SELECT 
                COLLEGE.COLLEGE_NAME,
                COLLEGE.INSTITUTE_CODE,
                COLLEGE.NIRF_RANK,
                COLLEGE.CITY,
                COLLEGE.HOME_UNIVERSITY,
                COLLEGE.STATUS,
                COLLEGE.HOBBY,
                CUTOFF.BRANCH,
                CUTOFF.OPEN
            FROM COLLEGE 
            LEFT JOIN CUTOFF ON COLLEGE.INSTITUTE_CODE = CUTOFF.INSTITUTE_CODE
        `;

        let conditions = [];
        let queryParams = [];

        // Apply filters if provided
        if (branch) {
            conditions.push(`CUTOFF.BRANCH ILIKE $${queryParams.length + 1}`);
            queryParams.push(`%${branch}%`); // Case-insensitive search for the branch
        }

        if (hobbies) {
            // Split hobbies into an array and apply filter for each hobby
            const hobbiesArray = hobbies.split(',');
            hobbiesArray.forEach((hobby, index) => {
                conditions.push(`COLLEGE.HOBBY ILIKE $${queryParams.length + 1}`);
                queryParams.push(`%${hobby.trim()}%`); // Case-insensitive match for each hobby
            });
        }

        // If any conditions are set, add them to the query
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Query the database with the dynamic filters
        const result = await pool.query(query, queryParams);

        // Process the result into a more structured format
        const colleges = result.rows.reduce((acc, row) => {
            const institutioncode = String(row.institute_code);
            const nirfrank = row.nirf_rank !== null ? String(row.nirf_rank) : 'N/A';
            const name = row.college_name || '';
            const location = row.city || '';
            const university = row.home_university || '';
            const status = row.status || '';
            const hobbies = row.hobby ? row.hobby.split(', ') : [];
            const branchname = row.branch || '';
            const cutoff = row.open !== null ? String(row.open) : '0';

            // Check if the college is already in the accumulator
            let college = acc.find(c => c.institutioncode === institutioncode);
            if (!college) {
                // If not, create a new college entry
                college = {
                    name,
                    institutioncode,
                    nirfrank,
                    location,
                    university,
                    status,
                    hobbies,
                    branches: [] // Empty array for branches
                };
                acc.push(college);
            }

            // Add the branch and cutoff information to the college
            if (branchname) {
                college.branches.push({
                    branchname,
                    cutoff,
                });
            }

            return acc;
        }, []); // Empty array for the accumulator

        // Send the processed data as a JSON response
        res.json(colleges);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});





app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
