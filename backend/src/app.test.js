import request from 'supertest';
import app from './app.js';
import { it, vi } from 'vitest';
import { getSpot } from './services/spotService.js';

vi.mock('./services/spotService.js', () => ({
    getSpot: vi.fn()
}));

const mockSpot = {
    timestamp: '2026-04-04T14:00:00.000Z',
    stale: false,
    rates: { EUR: 1.0895, GBP: 1.2696 },
    gold: { oz_usd: 3120.50, g_fine_usd: 100.33, change: 15.75, change_pct: 0.51 },
    silver: { oz_usd: 34.20, g_fine_usd: 1.10, change: 0.45, change_pct: 1.33 }
};

describe('GET /health', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'succes' });
    });
});

describe('GET /spot/latest', () => {
    it('should return 200 with normalized spot data', async () => {
        getSpot.mockResolvedValueOnce(mockSpot);
        const res = await request(app).get('/spot/latest');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('gold');
        expect(res.body).toHaveProperty('silver');
        expect(res.body).toHaveProperty('rates');
        expect(res.body).toHaveProperty('timestamp');
    });
    it('should return 500 on service error', async () => {
        getSpot.mockRejectedValueOnce(new Error('Provider error'));
        const res = await request(app).get('/spot/latest');
        expect(res.status).toBe(500);
    });
});
