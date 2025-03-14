const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'db', // Service name in Docker Compose
  user: 'root',
  password: 'rootpassword',
  database: 'mydb'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// API Route
app.get('/', (req, res) => {
  res.send('Hello from Node.js Backend!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

