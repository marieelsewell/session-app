const request = require('supertest');
const server = require('../src/server');
const { sequelize, Lyric, Session, User } = require('../src/models');

describe('LYRIC ROUTES', () => {

    beforeAll( async () => {
        // connect to the test db
        await sequelize.authenticate();

        // sync all models
        await sequelize.sync({ force: true });
    });

    beforeEach( async () => {
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

        // create lyric for testing
        await Lyric.create({
            user_id: 1,
            title: 'Test Lyric',
            content: 'This is a test lyric.'
        });
    });

    afterAll ( async () => {
        await server.close();
        await sequelize.close();
    });

    afterEach ( async () => {

    });

    // CREATE
    // --------------------------------------------------------

    describe('POST /api/route', () => {

        it('it should create a new lyric given user id, session id, title, and lyric content', async () => {
            const newLyric = {
                user_id: 1,
                session_id: 1,
                title: 'Test Lyric',
                content: 'This is also a test lyric.'
            };

            const response = await request(server)
                .post('/api/lyrics')
                .send(newLyric);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.user_id).toBe(newLyric.user_id);
            expect(response.body.content).toBe(newLyric.content);
        });

        // it should create a new lyric given a null session id
        it('it should create a new lyric given a null session id', async () => {
            const newLyric = {
                user_id: 1,
                session_id: null,
                title: 'Test Lyric',
                content: 'This is also a test lyric.'
            };

            const response = await request(server)
                .post('/api/lyrics')
                .send(newLyric);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.user_id).toBe(newLyric.user_id);
            expect(response.body.content).toBe(newLyric.content);
        });

        // it should create a new lyric given no title
        it('it should create a new lyric given no title', async () => {
            const newLyric = {
                user_id: 1,
                session_id: 1,
                content: 'This is also a test lyric.'
            };

            const response = await request(server)
                .post('/api/lyrics')
                .send(newLyric);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.user_id).toBe(newLyric.user_id);
            expect(response.body.content).toBe(newLyric.content);
        });

        // should  return an error when creating lyrics without authentication

        // should successfully create multiple lyrics for one user
        it('should successfully create multiple lyrics for one user and one session', async () => {
            const newLyric1 = {
                user_id: 1,
                session_id: 1,
                title: 'Test Lyric 1',
                content: 'This is a test lyric 1.'
            };

            const newLyric2 = {
                user_id: 1,
                session_id: 1,
                title: 'Test Lyric 2',
                content: 'This is a test lyric 2.'
            };

            const response1 = await request(server)
                .post('/api/lyrics')
                .send(newLyric1);

            const response2 = await request(server)
                .post('/api/lyrics')
                .send(newLyric2);

            expect(response1.status).toBe(201);
            expect(response2.status).toBe(201);
        });

    
    });

    // RETRIEVE
    // --------------------------------------------------------

    describe('GET /api/route', () => {

        // should get all lyrics for a given user id 
        it('should get all lyrics for a given user id', async () => {

            await Lyric.create({
                user_id: 1,
                content: 'This is a test lyric 2.'
            });

            await Lyric.create({
                user_id: 1,
                content: 'This is a test lyric 3.'
            });

            const response = await request(server)
                .get('/api/lyrics/1');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body[0].user_id).toBe(1);
        });

        // should retrieve lyric given title
        it('should retrieve lyric given title', async () => {
            const response = await request(server)
                .get('/api/lyrics/title/Test Lyric');

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Lyric');
            expect(response.body.content).toBe('This is a test lyric.');
        });

    });

    // UPDATE
    // --------------------------------------------------------

    describe('UPDATE /api/route', () => {

        // should update lyric title 
        it('should update lyric title', async () => {

            // create a new lyric
            const newLyric = {
                user_id: 1,
                title: 'Test update Lyric',
                content: 'This is a test lyric.'
            };

            // get id of the new lyric
            const createdLyric = await Lyric.create(newLyric);

            const updatedLyric = {
                user_id: createdLyric.user_id,
                title: 'Updated Lyric',
                content: createdLyric.content
            };

            const response = await request(server)
                .put(`/api/lyrics/${createdLyric.id}`)
                .send(updatedLyric);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedLyric.title);
        });

        // should return error if updating name for non-existent lyric

        // should update lyric content
        it('should update lyric content', async () => {
            // create a new lyric
            const newLyric = {
                user_id: 1,
                title: 'Test update Lyric',
                content: 'This is a test lyric.'
            };

            // get id of the new lyric
            const createdLyric = await Lyric.create(newLyric);

            const updatedLyric = {
                user_id: createdLyric.user_id,
                title: createdLyric.title,
                content: "updated content"
            };

            const response = await request(server)
                .put(`/api/lyrics/${createdLyric.id}`)
                .send(updatedLyric);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedLyric.title);
            expect(response.body.content).toBe(updatedLyric.content);
        });

        // should return error for updating content for non existent lyric
        it('should return error for updating content for non existent lyric', async () => {
            const updatedLyric = {
                user_id: 1,
                title: 'Updated Lyric',
                content: 'Updated content'
            };

            const response = await request(server)
                .put('/api/lyrics/9999')
                .send(updatedLyric);

            expect(response.status).toBe(404);
        });

    });

    // DELETE
    // --------------------------------------------------------

    describe('DELETE /api/route', () => {

        // it should delete all lyrics for a user when the user is deleted
        it('it should delete all lyrics for a user when the user is deleted', async () => {

            // delete user
            await User.destroy({
                where: {
                    id: 1
                }
            });

            // check if lyrics are deleted
            const lyrics = await Lyric.findAll({
                where: {
                    user_id: 1
                }
            });

            // make sure there are no lyrics with user id 1
            expect(lyrics.length).toBe(0);
        });

        // should successfull delete lyric given lyric id 
        it('should successfully delete lyric given lyric id', async () => {
            const response = await request(server)
                .delete('/api/lyrics/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Lyric deleted successfully');
        });
        
        // should delete lyric if the session it belongs to is deleted
        it('should delete lyric if the session it belongs to is deleted', async () => {
            // delete session
            await Session.destroy({
                where: {
                    id: 1
                }
            });

            // check if lyrics are deleted
            const lyrics = await Lyric.findAll({
                where: {
                    session_id: 1
                }
            });

            // make sure there are no lyrics with session id 1
            expect(lyrics.length).toBe(0);
        });

        // should return error if attempting to delete non-existent lyric
        it('should return error if attempting to delete non-existent lyric', async () => {
            const response = await request(server)
                .delete('/api/lyrics/9999'); 

            expect(response.status).toBe(404);
        });
    });

});