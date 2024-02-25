// app.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Add this line to set EJS as the view engine
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shayan717.',
  database: 'Project'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create the "Student" table
connection.query(
  "CREATE TABLE IF NOT EXISTS student (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), password VARCHAR(255), email VARCHAR(255), phone VARCHAR(255), CNIC VARCHAR(255), age INT, dietaryPreferences VARCHAR(255), familyMembers INT)",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Student table created successfully');
    }
  }
);

// Create the "FoodVote" table
connection.query(
  "CREATE TABLE IF NOT EXISTS food_vote (id INT AUTO_INCREMENT PRIMARY KEY, choice VARCHAR(255))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('FoodVote table created successfully');
    }
  }
);

// Create the "Votes" table
connection.query(
  "CREATE TABLE IF NOT EXISTS votes (id INT AUTO_INCREMENT PRIMARY KEY, choice VARCHAR(255))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Votes table created successfully');
    }
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS performance_requests (id INT AUTO_INCREMENT PRIMARY KEY, performanceType VARCHAR(255), duration VARCHAR(255), specialRequirements TEXT)",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('PerformanceRequests table created successfully');
    }
  }
);

const port = 3000;

// Route to handle the signup form submission
app.post('/signup', (req, res) => {
  const { name, username, password, email, phone, CNIC, age, dietaryPreferences, familyMembers } = req.body;

  let sql = "INSERT INTO student (name, username, password, email, phone, CNIC, age, dietaryPreferences, familyMembers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let values = [name, username, password, email, phone, CNIC, age, dietaryPreferences, familyMembers];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      // Check for specific MySQL error code for duplicate entry
      if (err.code === 'ER_DUP_ENTRY') {
        res.send('Authentication: Duplicate Entry');
      } else {
        res.send('Authentication: False');
      }
    } else {
      // Redirect to the dashboard after successful signup
      res.redirect('/dashboard');
    }
  });
});

app.post('/propose-performance', (req, res) => {
  const { performanceType, duration, specialRequirements } = req.body;

  let sql = "INSERT INTO performance_requests (performanceType, duration, specialRequirements) VALUES (?, ?, ?)";
  let values = [performanceType, duration, specialRequirements];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Performance proposal failed.');
    } else {
      // Redirect to the most requested performance page after successful proposal
      res.redirect('/most-requested-performance');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM student WHERE username = ? AND password = ?";
  let values = [username, password];

  connection.query(sql, values, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Authentication: False');
    } else {
      // Redirect to the new dashboard after successful login
      res.redirect('/new-dashboard');
    }
  });
});

// Route to handle food voting and redirect to the new dashboard
app.post('/vote', (req, res) => {
  const { choice } = req.body;

  // Insert the vote into the votes table
  let sql = "INSERT INTO votes (choice) VALUES (?)";
  let values = [choice];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Food voting failed.');
    } else {
      // Redirect to the most voted food page after successful voting
      res.redirect('/most-voted');
    }
  });
});

// Route to render the new dashboard with options to vote for food or propose performances
app.get('/new-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'newDashboard.html'));
});


app.get('/propose-performance', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'proposePerformance.html'));
});


app.get('/vote', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'vote.html'));
});


app.get('/most-voted', (req, res) => {
  // Query to find the most voted food
  let sql = "SELECT choice, COUNT(*) as vote_count FROM votes GROUP BY choice ORDER BY vote_count DESC LIMIT 1";

  connection.query(sql, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Error finding most voted food.');
    } else {
      const mostVotedFood = results[0].choice;
      // Render the mostVoted.ejs file
      res.render('mostVoted', { mostVotedFood });
    }
  });
});


app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'dashboard.html'));
});


app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'signup.html'));
});


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'login.html'));
});


app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'forgotPassword.html'));
});


app.post('/forgot-password', (req, res) => {
  const { username, newPassword } = req.body;

  let sql = "UPDATE student SET password = ? WHERE username = ?";
  let values = [newPassword, username];

  connection.query(sql, values, (err, results) => {
    if (err || results.affectedRows === 0) {
      console.error(err);
      res.send('Password update failed. Please check your username.');
    } else {
      res.send('Password updated successfully');
    }
  });
});

app.get('/most-requested-performance', (req, res) => {
  // Query to find the most requested performance
  let sql = "SELECT performanceType, COUNT(*) as request_count FROM performance_requests GROUP BY performanceType ORDER BY request_count DESC LIMIT 1";

  connection.query(sql, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Error finding most requested performance.');
    } else {
      const mostRequestedPerformance = results[0].performanceType;
      // Render the mostRequestedPerformance.ejs file
      res.render('mostRequestedPerformance', { mostRequestedPerformance });
    }
  });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
