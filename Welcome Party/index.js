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

connection.query(
  "CREATE TABLE IF NOT EXISTS teacher (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), family1 VARCHAR(255), family2 VARCHAR(255))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Teacher table created successfully');
    }
  }
);

// Create the "Organizer" table
connection.query(
  "CREATE TABLE IF NOT EXISTS organizer (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), password VARCHAR(255))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Organizer table created successfully');
    }
  }
);

// Create the "DecorationTasks" table
connection.query(
  "CREATE TABLE IF NOT EXISTS decoration_tasks (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT, decoration_task VARCHAR(255), budget DECIMAL(10, 2), FOREIGN KEY (student_id) REFERENCES student(id))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('DecorationTasks table created successfully');
    }
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS menu_items (id INT AUTO_INCREMENT PRIMARY KEY, item_name VARCHAR(255), price DECIMAL(10, 2))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('MenuItems table created successfully');
    }
  }
);


// Add this connection query to create the new table
connection.query(
  "CREATE TABLE IF NOT EXISTS senior_student (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255), password VARCHAR(255), managertype VARCHAR(50))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('SeniorStudent table created successfully');
    }
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS invitations (id INT AUTO_INCREMENT PRIMARY KEY, date DATE, venue VARCHAR(255))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Invitations table created successfully');
    }
  }
);

// Create the "Principal" table
connection.query(
  "CREATE TABLE IF NOT EXISTS principal (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255))",
  (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Principal table created successfully');
    }
  }
);


const port = 3000;

// Route to handle principal login
app.post('/principal-login', (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM principal WHERE username = ? AND password = ?";
  let values = [username, password];

  connection.query(sql, values, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Authentication: False');
    } else {
      // Redirect to the principal dashboard after successful login
      res.redirect('/principal-dashboard');
    }
  });
});


// Route to handle removing a person
app.post('/remove-person', (req, res) => {
  const { personType, personId } = req.body;

  let sql, values;

  if (personType === 'student') {
    sql = "DELETE FROM student WHERE id = ?";
  } else if (personType === 'senior_student') {
    sql = "DELETE FROM senior_student WHERE id = ?";
  }
  // Add other DELETE statements for other person types as needed

  values = [personId];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Remove person failed.');
    } else {
      // Redirect to the principal dashboard after successful removal
      res.redirect('/principal-dashboard');
    }
  });
});


app.get('/principal-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'principalLogin.html'));
});

// Add this route to handle principal login form submission
app.post('/principal-login', (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM principal WHERE username = ? AND password = ?";
  let values = [username, password];

  connection.query(sql, values, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Authentication: False');
    } else {
      // Redirect to the principal dashboard after successful login
      res.redirect('/principal-dashboard');
    }
  });
});


// Route to render the principal dashboard
app.get('/principal-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'principalDashboard.html'));
});


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


app.post('/teacher-signup', (req, res) => {
  const { name, password, family1, family2 } = req.body;

  let sql = "INSERT INTO teacher (name, password, family1, family2) VALUES (?, ?, ?, ?)";
  let values = [name, password, family1, family2];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      // Handle duplicate entry or other errors
      res.send('Teacher registration failed.');
    } else {
      // Redirect to the main dashboard after successful signup
      res.redirect('/dashboard');
    }
  });
});

app.post('/teacher-login', (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM teacher WHERE name = ? AND password = ?";
  let values = [username, password];

  connection.query(sql, values, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Authentication: False');
    } else {
      // Redirect to the main dashboard after successful login
      res.redirect('/dashboard');
    }
  });
});


// Route to handle organizer signup form submission
app.post('/organizer-signup', (req, res) => {
  const { name, username, password } = req.body;

  let sql = "INSERT INTO organizer (name, username, password) VALUES (?, ?, ?)";
  let values = [name, username, password];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      // Handle duplicate entry or other errors
      res.send('Organizer registration failed.');
    } else {
      // Redirect to the main dashboard after successful signup
      res.redirect('/dashboard');
    }
  });
});

// Route to handle organizer login form submission
app.post('/organizer-login', (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM organizer WHERE username = ? AND password = ?";
  let values = [username, password];

  connection.query(sql, values, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Authentication: False');
    } else {
      // Redirect to the organizer dashboard after successful login
      res.redirect('/organizer-dashboard');
    }
  });
});


app.post('/assign-decoration', (req, res) => {
  const { student, decorationTask, budget } = req.body;

  let sql = "INSERT INTO decoration_tasks (student_id, decoration_task, budget) VALUES (?, ?, ?)";
  let values = [student, decorationTask, budget];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Decoration task assignment failed.');
    } else {
      // Redirect to the organizer dashboard after successful task assignment
      res.redirect('/organizer-dashboard');
    }
  });
});

app.post('/update-budget', (req, res) => {
  const { studentId, newBudget } = req.body;

  let sql = "UPDATE decoration_tasks SET budget = ? WHERE student_id = ?";
  let values = [newBudget, studentId];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Budget update failed.');
    } else {
      // Redirect to the organizer dashboard after successful budget update
      res.redirect('/organizer-dashboard');
    }
  });
});

app.post('/senior-student-signup', (req, res) => {
  const { name, username, password, managertype } = req.body;

  let sql = "INSERT INTO senior_student (name, username, password, managertype) VALUES (?, ?, ?, ?)";
  let values = [name, username, password, managertype];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      // Handle duplicate entry or other errors
      res.send('Senior student registration failed.');
    } else {
      // Redirect to the appropriate dashboard after successful signup
      res.redirect(`/senior-student-dashboard?managertype=${managertype}`);
    }
  });
});

app.post('/senior-student-login', (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM senior_student WHERE username = ? AND password = ?";
  let values = [username, password];

  connection.query(sql, values, (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      res.send('Authentication: False');
    } else {
      const managertype = results[0].managertype;

      if (managertype === 'dinner') {
        // Redirect to the manage menu page for dinner manager type
        res.redirect('/manage-menu');
      } else if (managertype === 'performance') {
        // Redirect to the view performances page for performance manager type
        res.redirect('/view-performances');
      } else if (managertype === 'invitation') {
        // Redirect to the create invitation page for invitation manager type
        res.redirect('/create-invitation');
      } else if (managertype === 'budget') {
        // Redirect to the manage budgets page for budget manager type
        res.redirect('/manage-budgets');
      } else {
        // Redirect to a different page or dashboard based on other manager types
        res.send('Redirect to a different page for other manager types');
      }
    }
  });
});


// Route to render the manage budgets page
app.get('/manage-budgets', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'manageBudgets.html'));
});

// Route to handle updating budgets and prices
app.post('/update-budget-price', (req, res) => {
  const { type, itemId, newBudgetOrPrice } = req.body;

  let sql, values;

  if (type === 'decoration') {
    // Update budget in decoration_tasks table
    sql = "UPDATE decoration_tasks SET budget = ? WHERE id = ?";
    values = [newBudgetOrPrice, itemId];
  } else if (type === 'menu') {
    // Update price in menu_items table
    sql = "UPDATE menu_items SET price = ? WHERE id = ?";
    values = [newBudgetOrPrice, itemId];
  }

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Update budget or price failed.');
    } else {
      // Redirect to the view budgets and prices page after successful update
      res.redirect('/view-budgets-prices');
    }
  });
});



// Route to render the create invitation page
app.get('/create-invitation', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'createInvitation.html'));
});

// Route to handle adding new invitations
app.post('/add-invitation', (req, res) => {
  const { date, venue } = req.body;

  let sql = "INSERT INTO invitations (date, venue) VALUES (?, ?)";
  let values = [date, venue];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Creating invitation failed.');
    } else {
      // Redirect to the view invitations page after successfully creating an invitation
      res.redirect('/view-invitations');
    }
  });
});


// Route to render the view invitations page
app.get('/view-invitations', (req, res) => {
  // Query to get all invitations
  let sql = "SELECT * FROM invitations";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error retrieving invitations.');
    } else {
      const invitations = results;
      res.render('viewInvitations', { invitations });
    }
  });
});

// Route to render the view budgets and prices page
app.get('/view-budgets-prices', (req, res) => {
  // Query to get all decoration tasks and menu items
  let sql = "SELECT * FROM decoration_tasks; SELECT * FROM menu_items";

  connection.query(sql, [1, 2], (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error retrieving budgets and prices.');
    } else {
      const decorationTasks = results[0];
      const menuItems = results[1];
      res.render('viewBudgetsPrices', { decorationTasks, menuItems });
    }
  });
});



// Route to render the view performances page
app.get('/view-performances', (req, res) => {
  // Query to get all performance requests
  let sql = "SELECT * FROM performance_requests";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error retrieving performance requests.');
    } else {
      const performances = results;
      res.render('viewPerformances', { performances });
    }
  });
});


// Route to handle rejecting performances
app.get('/reject-performance/:id', (req, res) => {
  const performanceId = req.params.id;

  let sql = "DELETE FROM performance_requests WHERE id = ?";
  let values = [performanceId];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error rejecting performance.');
    } else {
      // Redirect to the view performances page after rejecting a performance
      res.redirect('/view-performances');
    }
  });
});


app.get('/manage-menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'manageMenu.html'));
});



// Route to handle adding new menu items
app.post('/add-menu-item', (req, res) => {
  const { itemName, price } = req.body;

  let sql = "INSERT INTO menu_items (item_name, price) VALUES (?, ?)";
  let values = [itemName, price];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Adding menu item failed.');
    } else {
      // Redirect to the view menu page after successfully adding a menu item
      res.redirect('/view-menu');
    }
  });
});



app.get('/view-menu', (req, res) => {
  // Query to get all current menu items
  let sql = "SELECT * FROM menu_items";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error retrieving menu items.');
    } else {
      const menuItems = results;
      res.render('viewMenu', { menuItems });
    }
  });
});

// Route to render the manage menu page
app.get('/manage-menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'manageMenu.html'));
});

app.get('/senior-student-signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'seniorStudentSignup.html'));
});

app.get('/senior-student-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'seniorStudentLogin.html'));
});


app.get('/organizer-dashboard', (req, res) => {
  // Query to get all available student IDs, names, decoration tasks, and budgets
  let sql = "SELECT student.id, student.name, decoration_tasks.decoration_task AS task, decoration_tasks.budget FROM student LEFT JOIN decoration_tasks ON student.id = decoration_tasks.student_id";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.send('Error retrieving student information.');
    } else {
      const students = results;
      res.render('organizerDashboard', { students });
    }
  });
});


// Route to render the organizer registration form
app.get('/organizer-registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'organizerRegistration.html'));
});

// Route to render the organizer login form
app.get('/organizer-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'organizerLogin.html'));
});



// Route to render the teacher registration form
app.get('/teacher-registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'teacherRegistration.html'));
});

// Route to render the teacher login form
app.get('/teacher-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'store', 'teacherLogin.html'));
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
