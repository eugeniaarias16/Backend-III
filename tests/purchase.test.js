import request from 'supertest';
import app from '../src/server.js';
import { describe, it, expect } from '@jest/globals';

describe('Mocking System Tests', () => {
    it('GET /api/mocks/mockingusers debe devolver 50 usuarios', async () => {
        const res = await request(app).get('/api/mocks/mockingusers');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.count).toBe(50);
    });

    it('GET /api/mocks/mockingproducts debe devolver productos mock', async () => {
        const res = await request(app).get('/api/mocks/mockingproducts');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.products).toBeInstanceOf(Array);
    });
});