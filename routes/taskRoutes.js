const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/tasks', async (req, res) => {
    const { id, title, description, status, isSynced, createdAt, updatedAt } = req.body;

    const statusToUpdate = status === 1 ? 'completed' : 'pending';

    // Validate input
    if (!id || !createdAt || !updatedAt) {
        return res.status(400).json({ error: 'Task ID, createdAt, and updatedAt are required' });
    }
    if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    try {
        // Check if the ID already exists
        const [existingTask] = await db.query('SELECT id FROM tasks WHERE id = ?', [id]);
        if (existingTask.length > 0) {
            const [result] = await db.query(
                `UPDATE tasks 
             SET title = ?, description = ?, status = ?, isSynced = ?, updatedAt = CURRENT_TIMESTAMP 
             WHERE id = ?`,
                [title, description, statusToUpdate, isSynced, id]
            );
            //return res.status(409).json({ error: 'Task with this ID already exists' });
        }

        // Insert the new task
        const [result] = await db.query(
            `INSERT INTO tasks (id, title, description, status, isSynced, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, title, description, statusToUpdate || 'pending', isSynced || false, createdAt, updatedAt]
        );
        res.status(201).json({ id, message: 'Task created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT * FROM tasks');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, isSynced } = req.body;
    const statusToUpdate = status === 1 ? 'completed' : 'pending';

    try {
        const [result] = await db.query(
            `UPDATE tasks 
             SET title = ?, description = ?, status = ?, isSynced = ?, updatedAt = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [title, description, statusToUpdate, isSynced, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
