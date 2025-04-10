const request = require('supertest');
const server = require('../src/server'); 
const { sequelize, User } = require('../src/models'); 

describe('USER ROUTES', () => {
    beforeAll(async () => {
        // Connect to the test database
        await sequelize.authenticate();
        
        // Sync all models
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await server.close();
        await sequelize.close();
    });

    describe('GET /api/users', () => {
        it('should return a list of users', async () => {
            const response = await request(server).get('/api/users');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user given username, unique email, and password', async () => {
            const newUser = {
                username: 'testuser',
                email: 'testuser@example.com',
                password_hash: 'password123'
            };

            const response = await request(server)
                .post('/api/users')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toBe(newUser.username);
            expect(response.body.email).toBe(newUser.email);
        });
    });

    
    describe('GET /api/users/:id', () => {
        it('should return a single user by ID', async () => {
            const user = await User.create({
                username: 'testuser2',
                email: 'testuser2@example.com',
                password: 'password123'
            });

            const response = await request(server).get(`/api/users/${user.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', user.id);
            expect(response.body.username).toBe(user.username);
            expect(response.body.email).toBe(user.email);
        });
    });
    
    describe('PUT /api/users/:id', () => {
        it('should update a user by ID', async () => {
            const user = await User.create({
                username: 'testuser3',
                email: 'testuser3@example.com',
                password: 'password123'
            });

            const updatedUser = {
                username: 'updateduser',
                email: 'updateduser@example.com'
            };

            const response = await request(server)
                .put(`/api/users/${user.id}`)
                .send(updatedUser);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe(updatedUser.username);
            expect(response.body.email).toBe(updatedUser.email);
        });
    });
    
    describe('DELETE /api/users/:id', () => {
        it('should delete a user by ID', async () => {
            const user = await User.create({
                username: 'testuser4',
                email: 'testuser4@example.com',
                password: 'password123'
            });

            const response = await request(server).delete(`/api/users/${user.id}`);
            expect(response.status).toBe(204);

            const deletedUser = await User.findByPk(user.id);
            expect(deletedUser).toBeNull();
        });
    });
});