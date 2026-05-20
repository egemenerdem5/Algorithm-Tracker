import request from 'supertest';
import express from 'express';
import problemRoutes from '../src/routes/problem.route.js';
import { connectDB } from '../src/config/db.js';

// Testler için sanal bir Express sunucusu ayağa kaldırıyoruz
const app = express();
app.use(express.json());
app.use('/api/problems', problemRoutes);

// Testler başlamadan önce veritabanına bağlan
beforeAll(async () => {
    await connectDB();
});

describe('Algorithm Tracker API Birim Testleri', () => {
    
    it('GET /api/problems rotası 200 OK dönmeli ve veri getirmeli', async () => {
        const res = await request(app).get('/api/problems');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('POST /api/problems eksik veride 400 hatası vermeli', async () => {
        const res = await request(app).post('/api/problems').send({
            difficulty: "Hard"
            // title bilerek boş bırakıldı
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });

});