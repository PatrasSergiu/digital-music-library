const request = require('supertest');
const app = require('../../app');
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const Song = require('../../models/song');

const SongMock = dbMock.define('song', {
  id: 1,
  title: 'Song 1',
  length: '3:45',
  albumId: 1
});

jest.mock('../../models/song', () => {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
});

describe('Song API Routes', () => {
  describe('GET /api/songs', () => {
    it('should return all songs', async () => {
      const mockSongs = [
        { id: 1, title: 'Song 1', length: '3:45', albumId: 1 },
        { id: 2, title: 'Song 2', length: '4:15', albumId: 2 }
      ];
      Song.findAll.mockResolvedValue(mockSongs);

      const response = await request(app).get('/api/songs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSongs);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Song.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/songs', () => {
    it('should create a new song', async () => {
      const newSong = { id: 3, title: 'Song 3', length: '3:30', albumId: 1 };
      Song.create.mockResolvedValue(newSong);

      const response = await request(app)
        .post('/api/songs')
        .send({ title: 'Song 3', length: '3:30', albumId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newSong);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Song.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/songs/:id', () => {
    it('should return a song by ID', async () => {
      const song = { id: 1, title: 'Song 1', length: '3:45', albumId: 1 };
      Song.findByPk.mockResolvedValue(song);

      const response = await request(app).get('/api/songs/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(song);
      expect(Song.findByPk).toHaveBeenCalledWith('1', { include: [expect.any(Function)] });
    });

    it('should return 404 if song not found', async () => {
      Song.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/songs/999');
      expect(response.status).toBe(404);
      expect(response.text).toEqual('Song not found');
    });
  });

  describe('PUT /api/songs/:id', () => {
    it('should update a song by ID', async () => {
      const updatedSong = { id: 1, title: 'Updated Song', length: '3:45', albumId: 1 };
      Song.update.mockResolvedValue([1]);
      Song.findByPk.mockResolvedValue(updatedSong);

      const response = await request(app)
        .put('/api/songs/1')
        .send({ title: 'Updated Song' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedSong);
      expect(Song.update).toHaveBeenCalledWith({ title: 'Updated Song' }, { where: { id: '1' } });
      expect(Song.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 if song not found for update', async () => {
      Song.update.mockResolvedValue([0]);

      const response = await request(app)
        .put('/api/songs/999')
        .send({ title: 'Non-existent Song' });

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Song not found.');
    });
  });

  describe('DELETE /api/songs/:id', () => {
    it('should delete a song by ID', async () => {
      Song.destroy.mockResolvedValue(1);

      const response = await request(app).delete('/api/songs/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Song deleted successfully');
      expect(Song.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return 404 if song not found for deletion', async () => {
      Song.destroy.mockResolvedValue(0);

      const response = await request(app).delete('/api/songs/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Song not found');
    });
  });

});
