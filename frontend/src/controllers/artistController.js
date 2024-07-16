import { fetchArtists, postNewArtist, deleteArtistApi, updateArtistApi } from '../api/artistApi';

export const getArtists = async () => {
  return await fetchArtists();
};

export const addNewArtist = async (artistData) => {
  return await postNewArtist(artistData);
};

export const deleteArtist = async (artistId) => {
  return await deleteArtistApi(artistId);
};

export const updateArtist = async (artistId, artistData) => {
  return await updateArtistApi(artistId, artistData);
};