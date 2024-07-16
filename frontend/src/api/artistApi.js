import axios from 'axios';

const ARTIST_BASE_URL = 'http://localhost:3000/api/artists';

export const fetchArtists = async () => {
  try {
    const response = await axios.get(`${ARTIST_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch artists:', error);
    return [];
  }
};

export const postNewArtist = async (artistData) => {
  try {
    const response = await axios.post(`${ARTIST_BASE_URL}`, artistData);
    return response.data;
  } catch (error) {
    console.error('Failed to post new artist:', error);
    throw error;
  }
};

export const deleteArtistApi = async (artistId) => {
  try {
    const response = await axios.delete(`${ARTIST_BASE_URL}/${artistId}`);
    if (response.status !== 200) {
      throw new Error('Failed to delete artist');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateArtistApi = async (artistId, artistData) => {
    console.log(artistId);
    try {
      const response = await axios.put(`${ARTIST_BASE_URL}/${artistId}`, artistData);
      if (response.status !== 200) {
        throw new Error('Failed to update artist');
      }
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Failed to update artist:', error);
      throw error;
    }
  };