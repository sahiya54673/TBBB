const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes are protected
router.use(protect);

// GET /api/tasks/stats — get task statistics
router.get('/stats', getTaskStats);

// GET  /api/tasks      — list all tasks (with optional filters)
// POST /api/tasks      — create a task
router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title', 'Title is required').notEmpty().trim(),
      body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Invalid status value'),
      body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority value'),
    ],
    createTask
  );

// GET    /api/tasks/:id — get single task
// PUT    /api/tasks/:id — update task
// DELETE /api/tasks/:id — delete task
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
