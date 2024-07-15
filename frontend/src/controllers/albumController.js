import { fetchAlbums, postNewAlbum, fetchSongsByAlbum } from '../api/albumApi';

export const getAlbums = async () => {
  return await fetchAlbums();
};

export const addNewAlbum = async (albumData) => {
  return await postNewAlbum(albumData);
};

export const getSongsByAlbum = async (albumId) => {
    return await fetchSongsByAlbum(albumId);
}

