import request from 'supertest'
import app from './app.js'
import { it, vi } from 'vitest'
import { getLatestSpotWithVariation, getSpotToday } from './services/spotService.js';

// Mock les datas pour les tests
vi.mock('./services/spotService.js', () => ({
    getSpotToday: vi.fn(),
    getLatestSpotWithVariation: vi.fn()    
})); 


// Test pour la route /health
describe('GET /health', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/health')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ status: 'succes' })
    });
});

// Test les routes liées au spot
describe('GET /spot/latest', () => {
    
    it('should return 200 with data', async () => {
        getSpotToday.mockResolvedValueOnce([{ metal: 'gold', oz_price_usd: 3000 }]);

        const res = await request(app).get('/spot/latest');
        expect(res.status).toBe(200);
    });
    it('should return 404 if no data', async () => {
        getSpotToday.mockResolvedValueOnce(null);
        const res = await request(app).get('/spot/latest');
        expect(res.status).toBe(404);
    });
    it('should return 500 on error', async () => {
        getSpotToday.mockRejectedValueOnce(new Error('DB error'));
        const res = await request(app).get('/spot/latest');
        expect(res.status).toBe(500);
    });
});

describe('GET /spot/variation', () => {
    
    it('should return 200 with data', async () => {
        getLatestSpotWithVariation.mockResolvedValueOnce({ metal: 'gold', oz_price_usd: 3000, variation: 2 });

        const res = await request(app).get('/spot/variation');
        expect(res.status).toBe(200);
    });
    it ('should return 404 if no data', async () => {
        getLatestSpotWithVariation.mockResolvedValueOnce(null);
        const res = await request(app).get('/spot/variation');
        expect(res.status).toBe(404);
    });
    it('should return 500 on error', async () => {
        getLatestSpotWithVariation.mockRejectedValueOnce(new Error('DB error'));
        const res = await request(app).get('/spot/variation');
        expect(res.status).toBe(500);
    });
});

 
