const { Router } = require('express');
const Tasks = require('../models/Tasks.js');
const verifyToken = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");

const router = Router();
// GET ALL TASKS
router.get("/api/tasks", verifyToken, async (req, res) => {
    const { status, search, before, after } = req.query;

    const query = { userId: req.userId };

    if (status) {
        query.status = status;
    }

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    if (before || after) {
        query.deadline = {};
        if (after) query.deadline.$gte = new Date(after);
        if (before) query.deadline.$lte = new Date(before);
    }

    try {
        const tasks = await Tasks.find(query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al filtrar tareas", error });
    }
});



// GET TASK BY TITLE WITH VERIFY TOKEN
router.get("/api/tasks/title/:search", verifyToken, async (req, res) => {
    const { search } = req.params;

    try {
        const tasks = await Tasks.find({
            userId: req.userId,
            title: { $regex: new RegExp(search, "i") } // insensible a mayúsculas
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar por título", error });
    }
});

// GET TASK BY STATUS WITH VERIFY TOKEN
router.get("/api/tasks/status/:status", verifyToken, async (req, res) => {
    const { status } = req.params;

    try {
        const tasks = await Tasks.find({
            userId: req.userId,
            status: status
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al filtrar por estado", error });
    }
});

// GET TASK BY DEADLINE WITH VERIFY TOKEN
router.get("/api/tasks/deadline", verifyToken, async (req, res) => {
    const { before, after } = req.query;
    const filter = { userId: req.userId };

    if (before || after) {
        filter.deadline = {};
        if (before) filter.deadline.$lte = new Date(before);
        if (after) filter.deadline.$gte = new Date(after);
    }

    try {
        const tasks = await Tasks.find(filter);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al filtrar por fechas", error });
    }
});

// GET TASK BY ID WITH VERIFY TOKEN
router.get('/api/tasks/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const task = await Tasks.findById(id);
    try {
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// CREATE TASK WITH VERIFY TOKEN
router.post("/api/tasks",
    verifyToken,
    [
        body("title", "El título es obligatorio").notEmpty(),
        body("deadline", "Formato de fecha no válido")
            .optional()
            .isISO8601()
            .toDate(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, deadline } = req.body;

        try {
            const newTask = new Tasks({
                title,
                description,
                deadline,
                userId: req.userId,
            });

            await newTask.save();
            res.status(201).json({ message: "Tarea creada", task: newTask });
        } catch (error) {
            res.status(500).json({ message: "Error al crear tarea", error });
        }
    }
);


// UPDATE TASK WITH VERIFY TOKEN
// UPDATE TASK (status o campos editables)
router.put("/api/tasks/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status, title, description, deadline } = req.body;

    try {
        const task = await Tasks.findOne({ _id: id, userId: req.userId });
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        // Si se quiere cambiar el estado, validar transición
        if (status && status !== task.status) {
            const allowedTransitions = {
                pendiente: "en progreso",
                "en progreso": "completada",
            };
            const currentStatus = task.status;

            if (allowedTransitions[currentStatus] !== status) {
                return res.status(400).json({
                    message: `No se puede cambiar de estado de ${currentStatus} a ${status}`,
                });
            }

            task.status = status;
        }

        // Actualizar otros campos si vienen
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (deadline !== undefined) task.deadline = deadline;

        await task.save();

        res.json({ message: "Tarea actualizada", task });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tarea", error });
    }
});



// DELETE TASK WITH VERIFY TOKEN
router.delete("/api/tasks/:id", verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Tasks.findOne({ _id: id, userId: req.userId });
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        if (task.status !== "completada") {
            return res.status(400).json({ message: "Solo puedes eliminar tareas completadas" });
        }

        await task.deleteOne();
        res.json({ message: "Tarea eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar tarea", error });
    }
});


module.exports = router;