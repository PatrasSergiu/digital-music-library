const Song = require('../../models/song');
const Album = require('../../models/album');
const Artist = require('../../models/artist');
const { sequelize } = require('../../config/database');

describe('Song model', () => {
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

  test('should handle saving a song with required length', async () => {
    const artist = await Artist.create({ name: 'Artist For Song' }, { transaction: t });
    const album = await Album.create({ title: 'Album For Song', artistId: artist.id }, { transaction: t });
    const songData = { title: 'New Song', albumId: album.id, length: '3:45' };
    const savedSong = await Song.create(songData, { transaction: t });
    expect(savedSong.id).not.toBeNull();
    expect(savedSong.title).toEqual('New Song');
    expect(savedSong.length).toEqual('3:45');
  });

  test('should find a song by ID', async () => {
    const artist = await Artist.create({ name: 'Artist For Finding Song' }, { transaction: t });
    const album = await Album.create({ title: 'Album For Finding Song', artistId: artist.id }, { transaction: t });
    const song = await Song.create({ title: 'Findable Song', albumId: album.id, length: '2:30' }, { transaction: t });
    const foundSong = await Song.findByPk(song.id, { transaction: t });
    expect(foundSong.title).toEqual('Findable Song');
    expect(foundSong.length).toEqual('2:30');
  });

  test('should update a song', async () => {
    const artist = await Artist.create({ name: 'Artist For Update Song' }, { transaction: t });
    const album = await Album.create({ title: 'Album For Update Song', artistId: artist.id }, { transaction: t });
    const song = await Song.create({ title: 'Before Update Song', albumId: album.id, length: '4:00' }, { transaction: t });
    await song.update({ title: 'After Update Song', length: '4:05' }, { transaction: t });

    const updatedSong = await Song.findByPk(song.id, { transaction: t });
    expect(updatedSong.title).toEqual('After Update Song');
    expect(updatedSong.length).toEqual('4:05');
  });

  test('should delete a song', async () => {
    const artist = await Artist.create({ name: 'Artist For Delete Song' }, { transaction: t });
    const album = await Album.create({ title: 'Album For Delete Song', artistId: artist.id }, { transaction: t });
    const song = await Song.create({ title: 'Delete This Song', albumId: album.id, length: '5:00' }, { transaction: t });
    await song.destroy({ transaction: t });

    const deletedSong = await Song.findByPk(song.id, { transaction: t });
    expect(deletedSong).toBeNull();
  });

  test('should fail to save a song without required length', async () => {
    expect.assertions(1);
    const artist = await Artist.create({ name: 'Artist Missing Length' }, { transaction: t });
    const album = await Album.create({ title: 'Album Missing Length', artistId: artist.id }, { transaction: t });
    const songData = { title: 'Song Without Length', albumId: album.id };

    try {
      await Song.create(songData, { transaction: t });
    } catch (error) {
      expect(error.message).toMatch(/length cannot be null/);
    }
  });

});
  
