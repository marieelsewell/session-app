const request = require('supertest');
const server = require('../src/server');
const path = require('path');
const { sequelize, Lyric, Session, User, Recording } = require('../src/models');
const fs = require('fs');

describe('RECORDING ROUTES', () => {

    beforeAll( async () => {
        // Connect to the test database
        await sequelize.authenticate();
        
        // Sync all models
        await sequelize.sync({ force: true });
    });

    beforeEach( async () => {

        await sequelize.sync({ force: true });

        // Create a test user
        const user = await User.create({
            username: 'testuser',
            email: 'testemail',
            password_hash: 'testpassword'
        });

        // Create a test session
        const session = await Session.create({
            user_id: user.id
        });

    });

    afterAll ( async () => {
        await server.close();
        await sequelize.close();

    });

    afterEach ( async () => {
        // Clean up the test database
        await sequelize.sync({ force: true });

        // Remove any uploaded files
        const dir = path.join(__dirname, '../src/uploads/audio');
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(dir, file), err => {
                    if (err) throw err;
                });
            }
        });
    });

    // CREATE
    // --------------------------------------------------------

    describe('POST /api/route', () => {

        it('should upload a file and store the correct filename', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });
            const session = await Session.findOne({ where: { user_id: user.id } });

            const response = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Recording uploaded!');
            expect(response.body.recording).toHaveProperty('file_path');
            const filePath = response.body.recording.file_path;
            console.log("Stored file path:", filePath);
            console.log("Checking existence at:", path.join(__dirname, '../src/', filePath));
            expect(fs.existsSync(path.join(__dirname, '../src/', filePath))).toBe(true);
        });

        // it should create a new recording given null session id 
        it('it should create a new recording given null session id', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });

            const response = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Recording uploaded!');
            expect(response.body.recording).toHaveProperty('file_path');
            const filePath = response.body.recording.file_path;
            console.log("Stored file path:", filePath);
            console.log("Checking existence at:", path.join(__dirname, '../src/', filePath));
            expect(fs.existsSync(path.join(__dirname, '../src/', filePath))).toBe(true);
        });

        it('it should return error if user id is not provided', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });

            const response = await request(server)
                .post('/api/recordings/upload')
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'User ID is required');
    
        });
    });

    // RETRIEVE
    // --------------------------------------------------------

    describe('GET /api/route', () => {

        // it should retrieve a recording by ID
        it('should retrieve a recording by ID', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });
            const session = await Session.findOne({ where: { user_id: user.id } });

            const newRecording = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            expect(newRecording.status).toBe(200);
            expect(newRecording.body).toHaveProperty('message', 'Recording uploaded!');
            expect(newRecording.body.recording).toHaveProperty('file_path');

            const response = await request(server)
                .get(`/api/recordings/${newRecording.body.recording.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', newRecording.body.recording.id);
        });

        // it should retrieve all recordings for a user
        it('should retrieve all recordings for a user', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });
            const session = await Session.findOne({ where: { user_id: user.id } });

            const newRecording1 = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            const newRecording2 = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound2.wav'));

            const newRecording3 = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound3.wav'));
            


            const response = await request(server)
                .get(`/api/recordings/user/${user.id}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);

        });

        // it should retrieve all recordings for a session
        it('should retrieve all recordings for a session', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });
            const session = await Session.findOne({ where: { user_id: user.id } });

            const newRecording1 = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            const newRecording2 = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound2.wav'));

            const response = await request(server)
                .get(`/api/recordings/session/${session.id}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

        });

    });


    // DELETE
    // --------------------------------------------------------

    describe('DELETE /api/route', () => {
        it('should delete a recording and its associated file', async () => {
            const user = await User.findOne({ where: { username: 'testuser' } });
            const session = await Session.findOne({ where: { user_id: user.id } });

            const newRecording = await request(server)
                .post('/api/recordings/upload')
                .field('user_id', user.id)
                .field('session_id', session.id)
                .field('duration', 120)
                .attach('file_path', path.resolve(__dirname, '../uploads/audio/sound.wav'));

            expect(newRecording.status).toBe(200);
            expect(newRecording.body).toHaveProperty('message', 'Recording uploaded!');
            expect(newRecording.body.recording).toHaveProperty('file_path');
          

            const response = await request(server)
                .delete(`/api/recordings/${newRecording.body.recording.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Recording deleted');

            // Check if the file was deleted
            const filePath = newRecording.body.recording.file_path;
            const fullPath = path.join(__dirname, '../src/', filePath);
            console.log("Checking file deletion at:", fullPath);
            expect(fs.existsSync(fullPath)).toBe(false);
        });
    });

});