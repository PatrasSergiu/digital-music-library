const Artist = require('../../models/artist');
const Album = require('../../models/album');
const { sequelize } = require('../../config/database');

describe('Artist model', () => {
  let t;

  beforeAll(async () => {
    try {
      await sequelize.sync({ force: false });
    } catch (error) {
      console.error('Failed to sync database:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    try {
      t = await sequelize.transaction();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  });

  afterEach(async () => {
    if (t) {
      await t.rollback();
    }
  });

  test('should handle saving an artist', async () => {
    const artistData = { name: 'New Artist' };
    const savedArtist = await Artist.create(artistData, { transaction: t });
    expect(savedArtist.id).not.toBeNull();
    expect(savedArtist.name).toEqual('New Artist');
  });

  test('should find an artist by ID', async () => {
    const artistData = { name: 'Findable Artist' };
    const artist = await Artist.create(artistData, { transaction: t });
    const foundArtist = await Artist.findByPk(artist.id, { transaction: t });
    expect(foundArtist.name).toEqual(artistData.name);
  });

  test('should update an artist', async () => {
    const artistData = { name: 'Before Update' };
    const artist = await Artist.create(artistData, { transaction: t });
    await artist.update({ name: 'After Update' }, { transaction: t });

    const updatedArtist = await Artist.findByPk(artist.id, { transaction: t });
    expect(updatedArtist.name).toEqual('After Update');
  });

  test('should delete an artist', async () => {
    const artistData = { name: 'Delete Me' };
    const artist = await Artist.create(artistData, { transaction: t });
    await artist.destroy({ transaction: t });

    const deletedArtist = await Artist.findByPk(artist.id, { transaction: t });
    expect(deletedArtist).toBeNull();
  });

  test('should return all artists', async () => {
    await Artist.create({ name: 'Artist One' }, { transaction: t });
    await Artist.create({ name: 'Artist Two' }, { transaction: t });

    const artists = await Artist.findAll({ transaction: t });
    expect(artists.length).toBeGreaterThanOrEqual(2);
    expect(artists.map(a => a.name)).toEqual(expect.arrayContaining(['Artist One', 'Artist Two']));
  });

  test('should find all albums for an artist', async () => {
    let artist, albums;
    try {
      artist = await Artist.create({ name: 'The Strokes' }, { transaction: t });
      albums = await Promise.all([
        Album.create({ title: 'Is This It', artistId: artist.id }, { transaction: t }),
        Album.create({ title: 'Room on Fire', artistId: artist.id }, { transaction: t })
      ]);

      const foundAlbums = await Album.findAll({
        where: { artistId: artist.id },
        transaction: t
      });

      expect(foundAlbums.length).toBe(2);
      expect(foundAlbums.map(a => a.title)).toEqual(expect.arrayContaining(['Is This It', 'Room on Fire']));
    } catch (error) {
      console.error('Failed to find albums:', error);
      throw new Error('Test failed due to unexpected error: ' + error.message);
    }
  });

  test('should fail to save an artist without a name', async () => {
    expect.assertions(1);
    try {
      await Artist.create({}, { transaction: t }); 
    } catch (error) {
      expect(error.message).toMatch(/name cannot be null/);
    }
  });

});