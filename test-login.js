// Test login script for joshfairbank@hotmail.com
// This will store the token in localStorage for testing membership detection

const testUser = {
  email: "joshfairbank@hotmail.com",
  password: "testpass123"
};

fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testUser)
})
.then(response => response.json())
.then(data => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    console.log('Login successful! Token stored.');
    console.log('User data:', data.user);
    // Reload the page to refresh the membership status
    window.location.reload();
  } else {
    console.error('Login failed:', data.message);
  }
})
.catch(error => {
  console.error('Error during login:', error);
});