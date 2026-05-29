import express from 'express';
import { getProblems, createProblem, updateProblem, deleteProblem, crawlProblem } from '../controllers/problem.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.get('/', verifyToken, getProblems);
router.post('/', verifyToken, createProblem);
router.put('/:id', verifyToken, updateProblem);
router.delete('/:id', verifyToken, deleteProblem);
router.post('/crawl', verifyToken, crawlProblem);

export default router;