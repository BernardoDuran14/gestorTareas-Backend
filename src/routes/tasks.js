const { Router } = require('express');
const Tasks = require('../models/Tasks.js');

const router = Router();
// GET ALL TASKS
router.get("/api/tasks", async (req, res) => {
    const tasks = await Tasks.find();
    res.json(tasks);
});

// GET TASK BY ID
router.get('/api/tasks/:id', async (req, res) => {
    const {id} = req.params;
    const task = await Tasks.findById(id);
    try{
        if(!task) return res.status(404).json({message: "Task not found"});
        res.json(task);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

// GET TASK BY TITLE
router.get('/api/tasks/title/:title', async (req, res) => {
    const {title} = req.params;
    try {
        const task = await Tasks.find({ title: { $regex: title, $options: 'i' } });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET TASK BY DEADLINE
router.get('/api/tasks/deadline/:deadline', async (req, res) => {
    const { deadline } = req.params;
    try {
        const task = await Tasks.find({ deadline: { $regex: deadline, $options: 'i' } });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE TASK
router.post('/api/tasks', async (req, res) => {
    const { title, description, status, deadline } = req.body;
    const newTasks = await Tasks({
        title: title,
        description: description,
        status: status,
        deadline: deadline
    });
    newTasks.save();
    res.json({msg: "Task created", newTasks});
});

// UPDATE TASK
router.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, deadline } = req.body;
    const task = await Tasks.findByIdAndUpdate(id, {
        title: title,
        description: description,
        status: status,
        deadline: deadline
    }, { new: true });
    res.json({ msg: "Task updated", task });
});

// DELETE TASK
router.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Tasks.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ msg: "Task deleted", task });
});

module.exports = router;