import request from 'supertest';
import app from '../server';

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('service', 'SmartFX Hub');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Welcome Route', () => {
  it('should return welcome message with modules', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version', '1.0.0');
    expect(response.body.modules).toContain('AI Forex Trading');
    expect(response.body.modules).toContain('Group Forex Trading');
    expect(response.body.modules).toContain('Self Forex Trading');
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });
});
