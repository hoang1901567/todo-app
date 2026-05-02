import {Router} from 'express';
import pool from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const {description, completed} = req.body;
        if (!description) {
            return res.status(400).json({error: "Description is required"});
        }
        const newTodo = await pool.query(
            "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *",
            [description, completed || false]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

//GET ALL TODOS
router.get("/", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

//UPDATE TODO
router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {description, completed} = req.body;
        if (!description) {
            return res.status(400).json({error: "Description is required"});
        }
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
            [description, completed || false, id]
        );
        if (updateTodo.rows.length === 0) {
            return res.status(404).json({error: "Todo not found"});
        }
        res.json({
            message: "TODO was updated",
            todo: updateTodo.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

//DELETE TODO
router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        if (deletedTodo.rowCount === 0) {
            return res.status(404).json({error: "Todo not found"});
        }
        res.json("Todo was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
