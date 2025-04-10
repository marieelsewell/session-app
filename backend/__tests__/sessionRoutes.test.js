const request = require('supertest');
const server = require('../src/server');
const { sequelize, Session, User } = require('../src/models');

describe('SESSION ROUTES', () => {
    beforeAll(async () => {
        // connect to the test db
        await sequelize.authenticate();

        // sync all models
        await sequelize.sync({ force: true });

    });

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        // create users for testing
        await User.create({
            username: 'user1',
            email: 'user1@email.com',
            password: 'pass'
        });

        //create session for testing
        await Session.create({
            user_id: 1
        });
    });

    afterAll(async () => {
        await server.close();
        await sequelize.close();
    });

    // CREATE
    // --------------------------------------------------------
    describe('POST /api/sessions', () => {
        // should create session given user id
        it('should create session given user id', async () => {
            const newSession = {
                user_id: 1
            };

            const response = await request(server)
                .post('/api/sessions')
                .send(newSession);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.user_id).toBe(newSession.user_id);
            expect(response.body.name).toBe('Untitled');
        });
    

        // should create multiple sessions for one user
        it('should create multiple sessions for one user', async () => {
            const newSession1 = {
                user_id: 1
            };

            const newSession2 = {
                user_id: 1
            };

            const response1 = await request(server)
                .post('/api/sessions')
                .send(newSession1);

            const response2 = await request(server)
                .post('/api/sessions')
                .send(newSession2);

            expect(response1.status).toBe(201);
            expect(response2.status).toBe(201);
        });

        // should not create session for invalid user id
        it('should not create a session for invalid user id', async () => {
            const newSession = {
                user_id: 9968987578
            };

            const response = await request(server)
                .post('/api/sessions')
                .send(newSession);

            expect(response.status).toBe(500);
            const session = await Session.findByPk(response.body.id);
            expect(session).toBeNull();

        });
    });
    // RETRIEVE
    // --------------------------------------------------------
    describe('GET /api/sessions/:id', () => {
        // should get session given session id
        it('should get session given valid session id', async () => {
            const getResponse = await request(server)
                .get('/api/sessions/1');
            expect(getResponse.status).toBe(200);
        });

        // should get all sessions given user id
        it('should get all sessions given user id', async () => {

            // create multiple sessions
            await Session.create({
                user_id: 1
            });
            await Session.create({
                user_id: 1
            });
            await Session.create({
                user_id: 1
            });

            const getResponse = await request(server)
                .get('/api/sessions?user_id=1');
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toHaveLength(4); 
        });

        // should not get session for invalid user id
        it('should not get session for invalid user id', async () => {
            const getResponse = await request(server)
                .get('/api/sessions?user_id=99999999');
            expect(getResponse.status).toBe(404);
        });

        // should not get session for invalid session_id
        it('should not get session for invalid session_id', async () => {
            const getResponse = await request(server)
                .get('/api/sessions/99999999');
            expect(getResponse.status).toBe(404);
        });

        // should not return session belonging to another user
    });
    

    // UPDATE
    // --------------------------------------------------------
    describe('PUT /api/sessions/:id', () => {
        // should update session name
        it('should update session name', async () => {
            const updateData = {
                name: 'Updated Name'
            };

            const updateResponse = await request(server)
                .put('/api/sessions/1')
                .send(updateData);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.name).toBe(updateData.name);
        });

        // should not update session for invalid session id
        it('should not update session for invalid session id', async () => {
            const updateData = {
                name: 'Updated Name'
            };

            const updateResponse = await request(server)
                .put('/api/sessions/99999999')
                .send(updateData);

            expect(updateResponse.status).toBe(404);
        });

        // should not update sessions belonging to another user
    });


    // DELETE
    // --------------------------------------------------------    
    describe('DELETE /api/sessions/:id', () => {
        // should delete session given session id
        it('should delete session given session id', async () => {
            const deleteResponse = await request(server)
                .delete('/api/sessions/1');
            expect(deleteResponse.status).toBe(200);
        });
        // should return error when deleting non-existent session
        it('should return error when deleting non-existent session', async () => {
            const deleteResponse = await request(server)
                .delete('/api/sessions/99999999');
            expect(deleteResponse.status).toBe(404);
        });
    });
});