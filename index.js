const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mongodbUri = '<YOUR_MONGODB_URI>'; // Replace with your MongoDB Atlas connection string
const port = process.env.PORT || 3000;

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const Student = mongoose.model('Student', studentSchema);

const app = express();
app.use(bodyParser.json());

// Create a new student record
app.post('/students', async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const newStudent = new Student({ name, age, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Could not create student record' });
  }
});

// Get all student records
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Could not get student records' });
  }
});

// Update a student record by ID
app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, { name, age, email }, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Could not update student record' });
  }
});

// Delete a student record by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete student record' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
