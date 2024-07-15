import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/albums'; // Change this to your actual API URL

export const fetchAlbums = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return []; // Return an empty array in case of error
  }
};

export const postNewAlbum = async (albumData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, albumData);
    return response.data;
  } catch (error) {
    console.error('Failed to post new album:', error);
    throw error; // Rethrow to handle it in the UI component
  }
};

export const fetchSongsByAlbum = async (albumId) => {
    try {
      const response = await fetch(`${BASE_URL}/${albumId}/songs`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      return data;
    } catch (error) {
        throw new Error('Failed to fetch songs');
    }
  };