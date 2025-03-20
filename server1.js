const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json()); // Middleware to parse JSON

// Read Data (GET all)
app.get('/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }
    res.json(JSON.parse(data));
  });
});

// Read Single Record (GET by ID)
app.get('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });

    const records = JSON.parse(data);
    const record = records.find(item => item.id === id);

    if (!record) return res.status(404).json({ error: 'Record not found' });

    res.json(record);
  });
});

// Create New Record (POST)
app.post('/data', (req, res) => {
  const newData = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });

    const records = JSON.parse(data);
    newData.id = records.length ? records[records.length - 1].id + 1 : 1; // Auto-increment ID
    records.push(newData);

    fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error writing file' });

      res.status(201).json(newData);
    });
  });
});

// Update Record (PUT)
app.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });

    let records = JSON.parse(data);
    const index = records.findIndex(item => item.id === id);

    if (index === -1) return res.status(404).json({ error: 'Record not found' });

    records[index] = { ...records[index], ...updatedData }; // Merge old & new data

    fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error writing file' });

      res.json(records[index]);
    });
  });
});

// Delete Record (DELETE)
app.delete('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });

    let records = JSON.parse(data);
    const newRecords = records.filter(item => item.id !== id);

    if (records.length === newRecords.length) return res.status(404).json({ error: 'Record not found' });

    fs.writeFile(DATA_FILE, JSON.stringify(newRecords, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error writing file' });

      res.json({ message: 'Record deleted successfully' });
    });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
