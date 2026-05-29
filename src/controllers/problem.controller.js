import { db } from '../config/db.js';
import axios from 'axios';


export const getProblems = async (req, res) => {
    try {
        const problems = await db.all('SELECT * FROM problems WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while fetching problems.' });
    }
};


export const createProblem = async (req, res) => {
    const { title, code, difficulty, topic } = req.body;
    if (!title) return res.status(400).json({ error: 'Title field is required!' });
    
    try {
        const result = await db.run(
            'INSERT INTO problems (userId, title, code, difficulty, topic) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, code, difficulty, topic]
        );
        res.status(201).json({ id: result.lastID, title, code, difficulty, topic });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while creating problem.' });
    }
};

export const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { title, code, difficulty, topic } = req.body;
    if (!title) return res.status(400).json({ error: 'Title field is required!' });
    
    try {
        const result = await db.run(
            'UPDATE problems SET title = ?, code = ?, difficulty = ?, topic = ? WHERE id = ? AND userId = ?',
            [title, code, difficulty, topic, id, req.user.id]
        );
        if (result.changes === 0) return res.status(404).json({ error: 'Problem not found or unauthorized.' });
        res.status(200).json({ id, title, code, difficulty, topic });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while updating problem.' });
    }
};

export const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.run('DELETE FROM problems WHERE id = ? AND userId = ?', [id, req.user.id]);
        if (result.changes === 0) return res.status(404).json({ error: 'Problem not found or unauthorized.' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error while deleting problem.' });
    }
};

export const crawlProblem = async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required for crawling!' });

    try {
        const match = url.match(/problems\/([^\/]+)/);
        if (!match) return res.status(400).json({ error: 'Invalid LeetCode URL format.' });
        
        const titleSlug = match[1];

        const response = await axios.post('https://leetcode.com/graphql', {
            query: `
                query questionTitle($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        title
                        difficulty
                        topicTags { name }
                    }
                }
            `,
            variables: { titleSlug }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const questionData = response.data.data.question;
        if (!questionData) return res.status(404).json({ error: 'Problem not found on LeetCode.' });

        const topics = questionData.topicTags.map(tag => tag.name).join(', ');

        res.status(200).json({ 
            title: questionData.title, 
            topic: topics || 'Web Crawled',
            difficulty: questionData.difficulty 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data. API might be blocking the request.' });
    }
};