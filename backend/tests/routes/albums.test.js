const request = require('supertest');
const app = require('../../app');
const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const Album = require('../../models/album');
const Song = require('../../models/song');

const AlbumMock = dbMock.define('album', {
  id: 1,
  title: 'Is This It',
  description: 'The debut studio album by American rock band the Strokes',
  artistId: 1
});

jest.mock('../../models/album', () => {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };
});

jest.mock('../../models/artist', () => {
  return {
    hasMany: jest.fn()
  };
});

jest.mock('../../models/song', () => {
  return {
    belongsTo: jest.fn(),
    findAll: jest.fn()
  };
});

describe('Album API Routes', () => {
  describe('GET /api/albums', () => {
    it('should return all albums', async () => {
      const mockAlbums = [
        { id: 1, title: 'Is This It', description: 'The debut studio album by American rock band the Strokes', artistId: 1 },
        { id: 2, title: 'Room on Fire', description: 'The second studio album by American rock band the Strokes', artistId: 1 }
      ];
      Album.findAll.mockResolvedValue(mockAlbums);

      const response = await request(app).get('/api/albums');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAlbums);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Album.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/albums', () => {
    it('should create a new album', async () => {
      const newAlbum = { id: 3, title: 'Angles', description: 'The fourth studio album by American rock band the Strokes', artistId: 1 };
      Album.create.mockResolvedValue(newAlbum);

      const response = await request(app)
        .post('/api/albums')
        .send({ title: 'Angles', description: 'The fourth studio album by American rock band the Strokes', artistId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newAlbum);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Album.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/albums/:id', () => {
    it('should return an album by ID', async () => {
      const album = { id: 1, title: 'Is This It', description: 'The debut studio album by American rock band the Strokes', artistId: 1 };
      Album.findByPk.mockResolvedValue(album);

      const response = await request(app).get('/api/albums/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(album);
      expect(Album.findByPk).toHaveBeenCalledWith("1", {"include": ["artist"]});
    });

    it('should return 404 if album not found', async () => {
      Album.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/albums/999');
      expect(response.status).toBe(404);
      expect(response.text).toEqual('Album not found');
    });
  });

  describe('PUT /api/albums/:id', () => {
    it('should update an album by ID', async () => {
      const updatedAlbum = { id: 1, title: 'Updated Album', description: 'Updated description', artistId: 1 };
      Album.update.mockResolvedValue([1]);
      Album.findByPk.mockResolvedValue(updatedAlbum);

      const response = await request(app)
        .put('/api/albums/1')
        .send({ title: 'Updated Album', description: 'Updated description' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedAlbum);
      expect(Album.update).toHaveBeenCalledWith({ title: 'Updated Album', description: 'Updated description' }, { where: { id: '1' } });
      expect(Album.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 if album not found for update', async () => {
      Album.update.mockResolvedValue([0]);

      const response = await request(app)
        .put('/api/albums/999')
        .send({ title: 'Non-existent Album', description: 'Non-existent description' });

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Album not found.');
    });
  });

  describe('DELETE /api/albums/:id', () => {
    it('should delete an album by ID', async () => {
      Album.destroy.mockResolvedValue(1);

      const response = await request(app).delete('/api/albums/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Album deleted successfully');
      expect(Album.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return 404 if album not found for deletion', async () => {
      Album.destroy.mockResolvedValue(0);

      const response = await request(app).delete('/api/albums/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Album not found');
    });
  });

  describe('GET /api/albums/:albumId/songs', () => {
    it('should return all songs for a given album', async () => {
      const mockSongs = [
        { id: 1, title: 'Song 1', length: '3:45', albumId: 1 },
        { id: 2, title: 'Song 2', length: '4:15', albumId: 1 }
      ];
      Song.findAll.mockResolvedValue(mockSongs);
  
      const response = await request(app).get('/api/albums/1/songs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSongs);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Song.findAll).toHaveBeenCalledWith({ where: { albumId: '1' } });
    });
  
    it('should return 404 if no songs found for the given album', async () => {
      Song.findAll.mockResolvedValue([]);
  
      const response = await request(app).get('/api/albums/999/songs');
      expect(response.status).toBe(404);
      expect(response.text).toEqual('No songs found for this album');
    });
  });
  

});
