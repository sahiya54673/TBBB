const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sort, search } = req.query;
    let filter = { user: req.user._id };

    // Optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const tasks = await Task.find(filter)
      .populate('user', 'name email')
      .sort(sortOption);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('user', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only owner can see their tasks
    if (task.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status, priority, dueDate, tags, reminderTime, isVoiceTask } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      reminderTime,
      isVoiceTask,
    });


    const populatedTask = await Task.findById(task._id)
      .populate('user', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Track completion time
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }
    if (req.body.status && req.body.status !== 'completed') {
      req.body.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get task stats (for dashboard)
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    const total = await Task.countDocuments(filter);
    const pending = await Task.countDocuments({ ...filter, status: 'pending' });
    const inProgress = await Task.countDocuments({ ...filter, status: 'in-progress' });
    const completed = await Task.countDocuments({ ...filter, status: 'completed' });

    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats };
