document.querySelector('.find-college').addEventListener('click', function() {
    alert('Redirecting to college search page...');
});

document.querySelector('.job-degree').addEventListener('click', function() {
    alert('Redirecting to degree programs...');
});

// Basic form validation for login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('Please fill out all fields.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
    }

    alert('Login successful! Redirecting...');
    // You can add further redirection here after successful login
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

// Basic form validation for signup
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please fill out all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    alert('Signup successful! Redirecting...');
    // You can add further redirection here after successful signup
});
