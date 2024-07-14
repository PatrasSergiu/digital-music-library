const request = require('supertest');
const app = require('../../app');
const Artist = require('../../models/artist');
const Album = require('../../models/album');

jest.mock('../../models/artist', () => {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };
});

jest.mock('../../models/album', () => {
  return {
    belongsTo: jest.fn(),
    findAll: jest.fn()
  };
});

jest.mock('../../models/song', () => {
  return {
    belongsTo: jest.fn()
  };
});

describe('Artist API Routes', () => {
  describe('GET /api/artists', () => {
    it('should return all artists', async () => {
      const mockArtists = [
        { id: 1, name: 'Tame Impala' },
        { id: 2, name: 'King Gizzard & The Lizard Wizard' }
      ];
      Artist.findAll.mockResolvedValue(mockArtists);

      const response = await request(app).get('/api/artists');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArtists);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Artist.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/artists', () => {
    it('should create a new artist', async () => {
      const newArtist = { id: 3, name: 'Unknown Mortal Orchestra' };
      Artist.create.mockResolvedValue(newArtist);

      const response = await request(app)
        .post('/api/artists')
        .send({ name: 'Unknown Mortal Orchestra' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newArtist);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Artist.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/artists/:id', () => {
    it('should return an artist by ID', async () => {
      const artist = { id: 1, name: 'Tame Impala' };
      Artist.findByPk.mockResolvedValue(artist);

      const response = await request(app).get('/api/artists/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(artist);
      expect(Artist.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 if artist not found', async () => {
      Artist.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/artists/999');
      expect(response.status).toBe(404);
      expect(response.text).toEqual('Artist not found');
    });
  });

  describe('PUT /api/artists/:id', () => {
    it('should update an artist by ID', async () => {
      const updatedArtist = { id: 1, name: 'Updated Artist' };
      Artist.update.mockResolvedValue([1]);
      Artist.findByPk.mockResolvedValue(updatedArtist);

      const response = await request(app)
        .put('/api/artists/1')
        .send({ name: 'Updated Artist' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedArtist);
      expect(Artist.update).toHaveBeenCalledWith({ name: 'Updated Artist' }, { where: { id: '1' } });
      expect(Artist.findByPk).toHaveBeenCalledWith('1');
    });

    it('should return 404 if artist not found for update', async () => {
      Artist.update.mockResolvedValue([0]);

      const response = await request(app)
        .put('/api/artists/999')
        .send({ name: 'Non-existent Artist' });

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Artist not found.');
    });
  });

  describe('DELETE /api/artists/:id', () => {
    it('should delete an artist by ID', async () => {
      Artist.destroy.mockResolvedValue(1);

      const response = await request(app).delete('/api/artists/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Artist deleted successfully');
      expect(Artist.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return 404 if artist not found for deletion', async () => {
      Artist.destroy.mockResolvedValue(0);

      const response = await request(app).delete('/api/artists/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Artist not found');
    });
  });

  describe('GET /api/artists/:artistId/albums', () => {
    it('should return all albums for a given artist', async () => {
      const mockAlbums = [
        { id: 1, title: 'Is This It', description: 'The debut studio album by American rock band the Strokes', artistId: 1 },
        { id: 2, title: 'Room on Fire', description: 'The second studio album by American rock band the Strokes', artistId: 1 }
      ];
      Album.findAll.mockResolvedValue(mockAlbums);

      const response = await request(app).get('/api/artists/1/albums');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAlbums);
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      expect(Album.findAll).toHaveBeenCalledWith({ where: { artistId: '1' } });
    });

    it('should return 404 if no albums found for the given artist', async () => {
      Album.findAll.mockResolvedValue([]);

      const response = await request(app).get('/api/artists/999/albums');
      expect(response.status).toBe(404);
      expect(response.text).toEqual('No albums found for the specified artist.');
    });
  });
});
