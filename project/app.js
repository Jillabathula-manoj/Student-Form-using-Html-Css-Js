
//app.js
 
 
const express = require('express');

const mysql = require('mysql2');
 
 
const app = express();

const port = 3000;
 
// MySQL Database Connection

const db = mysql.createConnection({

  host: 'localhost',

  user: 'root',

  password: 'Manoj@212',

  database: 'students',

});
 
db.connect((err) => {

  if (err) {

    console.error('Error connecting to MySQL database: ' + err.stack);

    return;

  }

  console.log('Connected to MySQL database');

});
 
// Function to check the uniqueness of a field in the database

async function checkUnique(field, value) {

  const sql = `SELECT COUNT(*) as count FROM students WHERE ${field} = ?`;
 
  return new Promise((resolve, reject) => {

    db.query(sql, [value], (err, result) => {

      if (err) {

        reject(err);

      } else {

        resolve(result[0].count === 0);

      }

    });

  });

}
 
// Middleware to parse JSON data (built-in in Express)

app.use(express.json());
 
// Serve static files (HTML, CSS, JS)

app.use(express.static('client'));
 
// API endpoint to handle form submissions

app.post('/submit', async (req, res) => {

  const { name, age, grade, phone, email } = req.body;
 
  // Check if email is unique

  try {

    const emailIsUnique = await checkUnique('email', email);

    if (!emailIsUnique) {

      res.status(400).send('Email already exists');

      return;

    }

  } catch (error) {

    console.error('Error checking email uniqueness:', error);

    res.status(500).send(`Internal Server Error: ${error.message}`);

    return;

  }
 
  // Check if phone is unique

  try {

    const phoneIsUnique = await checkUnique('phone', phone);

    if (!phoneIsUnique) {

      res.status(400).send('Phone number already exists');

      return;

    }

  } catch (error) {

    console.error('Error checking phone uniqueness:', error);

    res.status(500).send(`Internal Server Error: ${error.message}`);

    return;

  }
 
  // Insert data into MySQL database

  const sql = 'INSERT INTO students (name, age, grade, email, phone) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [name, age, grade, email, phone], (err, result) => {

    if (err) {

      console.error('Error inserting data into MySQL database:', err);

      res.status(500).send(`Internal Server Error: ${err.message}`);

      return;

    }

    console.log('Data inserted into MySQL database');

    res.status(200).send('Data inserted successfully');

  });

});


// Handle real-time validation against MySQL database
app.post('/validate', (req, res) => {
  const { name, age, grade,email,phone } = req.body;

  // Validate data against MySQL database
  const query = 'SELECT * FROM students WHERE name = ? OR age = ? OR grade = ? OR email = ? OR phone = ?';
  db.query(query, [name, age, grade, email,phone], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      // Data already exists in the database
      res.status(200).json({ exists: true });
    } else {
      // Data does not exist
      res.status(200).json({ exists: false });
    }
  });
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, mobile, email } = req.body;

  // Insert data into the database
  const insertQuery = 'INSERT INTO students (name, age, grade, email, phone) VALUES (?, ?, ?)';
  db.query(insertQuery, [name, age, grade, email, phone], (err) => {
    if (err) {
      console.error('Error inserting into database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json({ message: 'Data inserted into the database.' });


  });
});
 
// API endpoint to display submitted data

app.get('/display', (req, res) => {

  const sql = 'SELECT * FROM students';
 
  db.query(sql, (err, result) => {

    if (err) {

      console.error('Error fetching data from MySQL database:', err);

      res.status(500).send(`Internal Server Error: ${err.message}`);

      return;

    }
 
    res.status(200).json(result);

  });

});






// Get all data
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM students';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});
// Edit data
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  const query = 'UPDATE students SET ? WHERE id = ?';
  db.query(query, [newData, id], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Data updated successfully' });
  });
});

// Update route
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const query = 'UPDATE students SET ? WHERE id = ?';

  db.query(query, [updatedData, id], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Data updated successfully' });
  });
});

// delete the route definition
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM students WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Data deleted successfully' });
  });
});

// Assuming db is your database connection
app.get('/data/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM students WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Data not found' });
      return;
    }

    const student = results[0];
    res.json(student);
  });
});




// Start the server

app.listen(port, () => {

  console.log(`Server running at http://localhost:${port}`);

});