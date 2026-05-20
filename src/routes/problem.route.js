import express from 'express';
import { createProblem, getProblems, updateProblem, deleteProblem } from '../controllers/problem.controller.js';

const router = express.Router();

router.post('/', createProblem);
router.get('/', getProblems);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;