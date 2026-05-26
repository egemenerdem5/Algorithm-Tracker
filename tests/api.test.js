import request from 'supertest';
import express from 'express';
import problemRoutes from '../src/routes/problem.route.js';
import { connectDB } from '../src/config/db.js';

const app = express();
app.use(express.json());
app.use('/api/problems', problemRoutes);

beforeAll(async () => {
    await connectDB();
});

describe('Algorithm Tracker API Unit Tests', () => {
    
    it('GET /api/problems should return 200 OK and an array of problems', async () => {
        const res = await request(app).get('/api/problems');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('POST /api/problems should return 400 Bad Request on missing title', async () => {
        const res = await request(app).post('/api/problems').send({
            difficulty: "Hard"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

});