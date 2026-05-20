import { getDB } from '../config/db.js';

// 1. CREATE (Yeni problem ekleme)
export const createProblem = async (req, res) => {
    try {
        const { title, code, difficulty, topic } = req.body;
        if (!title) return res.status(400).json({ error: "Başlık zorunludur!" });

        const db = getDB();
        const result = await db.run(
            'INSERT INTO problems (title, code, difficulty, topic) VALUES (?, ?, ?, ?)',
            [title, code, difficulty, topic]
        );
        res.status(201).json({ id: result.lastID, title, difficulty, message: "Başarıyla eklendi!" });
    } catch (error) {
        res.status(500).json({ error: "Ekleme sırasında hata oluştu." });
    }
};

// 2. READ (Problemleri listeleme)
export const getProblems = async (req, res) => {
    try {
        const db = getDB();
        const problems = await db.all('SELECT * FROM problems');
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ error: "Veriler getirilemedi." });
    }
};

// 3. UPDATE (Problemi güncelleme)
export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, code, difficulty, topic } = req.body;
        
        const db = getDB();
        await db.run(
            'UPDATE problems SET title = ?, code = ?, difficulty = ?, topic = ? WHERE id = ?',
            [title, code, difficulty, topic, id]
        );
        res.status(200).json({ message: "Problem başarıyla güncellendi!" });
    } catch (error) {
        res.status(500).json({ error: "Güncelleme hatası." });
    }
};

// 4. DELETE (Problemi silme)
export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        await db.run('DELETE FROM problems WHERE id = ?', [id]);
        res.status(200).json({ message: "Problem silindi!" });
    } catch (error) {
        res.status(500).json({ error: "Silme hatası." });
    }
};