const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

// Task model
const Task = mongoose.model('Task', {
  name: String,
  completed: Boolean,
});

// API routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// Update Task (Edit name or toggle completed status)
app.put('/tasks/:id', async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return updated document
      );
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Error updating task" });
    }
  });
  

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/tasks`);
});
