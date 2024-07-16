import { fetchAlbums, postNewAlbum, fetchSongsByAlbum, deleteAlbumApi, fetchAlbumById, updateAlbumApi } from '../api/albumApi';

export const getAlbums = async () => {
  return await fetchAlbums();
};

export const addNewAlbum = async (albumData) => {
  try {
      const response = await postNewAlbum({title: albumData.title, artistId: albumData.artistId, description: albumData.description});
      console.log("Response", response)
      const fullAlbumData = await fetchAlbumById(response.id);
      return fullAlbumData;
  } catch (error) {
      console.error('Failed to add new album:', error);
      throw error;
  }
};

export const getSongsByAlbum = async (albumId) => {
    return await fetchSongsByAlbum(albumId);
}

export const deleteAlbum = (albumId) => {
  return deleteAlbumApi(albumId); 
}

export const updateAlbum = async (albumId, albumData) => {
  return await updateAlbumApi(albumId, albumData);
};