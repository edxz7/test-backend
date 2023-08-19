const { Router } = require('express');
const { createTask, deleteTask } = require('../controllers/tasks.controller');
const router = Router();

// /api/tasks
router.post('/', createTask)
router.delete('/:taskId', deleteTask)
module.exports = router;