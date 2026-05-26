import { db } from '../config/db.js';

export const getProblems = async (req, res) => {
    try {
        const problems = await db.all('SELECT * FROM problems ORDER BY createdAt DESC');
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching problems.' });
    }
};

export const createProblem = async (req, res) => {
    const { title, code, difficulty, topic } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title field is required!' });
    }
    try {
        const result = await db.run(
            'INSERT INTO problems (title, code, difficulty, topic) VALUES (?, ?, ?, ?)',
            [title, code, difficulty, topic]
        );
        res.status(201).json({ id: result.lastID, title, code, difficulty, topic });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while creating problem.' });
    }
};

export const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { title, code, difficulty, topic } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title field is required!' });
    }
    try {
        const result = await db.run(
            'UPDATE problems SET title = ?, code = ?, difficulty = ?, topic = ? WHERE id = ?',
            [title, code, difficulty, topic, id]
        );
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Problem not found.' });
        }
        res.status(200).json({ id, title, code, difficulty, topic });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while updating problem.' });
    }
};

export const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.run('DELETE FROM problems WHERE id = ?', [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Problem not found.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while deleting problem.' });
    }
};