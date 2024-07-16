import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/albums'; 

export const fetchAlbums = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return [];
  }
};

export const postNewAlbum = async (albumData) => {
  try {
    console.log(albumData);
    const response = await axios.post(`${BASE_URL}`, albumData);
    return response.data;
  } catch (error) {
    console.error('Failed to post new album:', error);
    throw error; 
  }
};

export const fetchAlbumById = async (albumId) => {
  try {
      const response = await axios.get(`${BASE_URL}/${albumId}`);
      return response.data;
  } catch (error) {
      console.error(`Failed to fetch album with ID ${albumId}:`, error);
      throw error;
  }
};

export const fetchSongsByAlbum = async (albumId) => {
  try {
    const response = await fetch(`${BASE_URL}/${albumId}/songs`);
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No songs found for this album.');
        return [];
      }
      throw new Error('Failed to fetch songs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
      throw error;
  }
};


  export const deleteAlbumApi = async (albumId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${albumId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete album');
        }
        return response.data; 
    } catch (error) {
        throw error;
    }
};

export const updateAlbumApi = async (albumId, albumData) => {
  console.log(albumId);
  try {
    const response = await axios.put(`${BASE_URL}/${albumId}`, albumData);
    if (response.status !== 200) {
      throw new Error('Failed to update album');
    }
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Failed to update album:', error);
    throw error;
  }
};