const Album = require('../../models/album');
const Song = require('../../models/song');
const Artist = require('../../models/artist');
const { sequelize } = require('../../config/database');

describe('Album model', () => {
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

  test('should handle saving an album', async () => {
    const artist = await Artist.create({ name: 'Artist For Album' }, { transaction: t });
    const albumData = { title: 'New Album', artistId: artist.id };
    const savedAlbum = await Album.create(albumData, { transaction: t });
    expect(savedAlbum.id).not.toBeNull();
    expect(savedAlbum.title).toEqual('New Album');
  });

  test('should find an album by ID', async () => {
    const artist = await Artist.create({ name: 'Artist For Finding' }, { transaction: t });
    const album = await Album.create({ title: 'Findable Album', artistId: artist.id }, { transaction: t });
    const foundAlbum = await Album.findByPk(album.id, { transaction: t });
    expect(foundAlbum.title).toEqual('Findable Album');
  });

  test('should update an album', async () => {
    const artist = await Artist.create({ name: 'Artist For Update' }, { transaction: t });
    const album = await Album.create({ title: 'Before Update', artistId: artist.id }, { transaction: t });
    await album.update({ title: 'After Update' }, { transaction: t });

    const updatedAlbum = await Album.findByPk(album.id, { transaction: t });
    expect(updatedAlbum.title).toEqual('After Update');
  });

  test('should delete an album', async () => {
    const artist = await Artist.create({ name: 'Artist For Deletion' }, { transaction: t });
    const album = await Album.create({ title: 'Delete This Album', artistId: artist.id }, { transaction: t });
    await album.destroy({ transaction: t });

    const deletedAlbum = await Album.findByPk(album.id, { transaction: t });
    expect(deletedAlbum).toBeNull();
  });

  test('should return all albums', async () => {
    const artist = await Artist.create({ name: 'Artist For All Albums' }, { transaction: t });
    await Album.create({ title: 'Album One', artistId: artist.id }, { transaction: t });
    await Album.create({ title: 'Album Two', artistId: artist.id }, { transaction: t });

    const albums = await Album.findAll({ where: { artistId: artist.id }, transaction: t });
    expect(albums.length).toBeGreaterThanOrEqual(2);
    expect(albums.map(a => a.title)).toEqual(expect.arrayContaining(['Album One', 'Album Two']));
  });

  test('should find all songs from an album', async () => {
    const artist = await Artist.create({ name: 'Artist With Songs' }, { transaction: t });
    const album = await Album.create({ title: 'Album With Songs', artistId: artist.id }, { transaction: t });
    await Song.create({ title: 'Song One', length: '3:30', albumId: album.id }, { transaction: t });
    await Song.create({ title: 'Song Two', length: '3:15', albumId: album.id }, { transaction: t });

    const songs = await Song.findAll({ where: { albumId: album.id }, transaction: t });
    expect(songs.length).toBe(2);
    expect(songs.map(s => s.title)).toEqual(expect.arrayContaining(['Song One', 'Song Two']));
  });

  //error handling
  test('should fail to save an album without a title', async () => {
    expect.assertions(1);
    const artist = await Artist.create({ name: 'Artist for Album' }, { transaction: t });
    try {
      await Album.create({ artistId: artist.id }, { transaction: t });
    } catch (error) {
      expect(error.message).toMatch(/title cannot be null/);
    }
  });

  test('should fail to save an album without an associated artist', async () => {
    try {
      await Album.create({ title: 'No artist' }, { transaction: t });  
    } catch (error) {
      expect(error.message).toMatch(/Validation error: artistId cannot be null/);
    }
  });

});
  