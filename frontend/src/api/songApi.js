import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/songs';

export const postNewSong = async (songDetails) => {
    try {
      const response = await axios.post(`${BASE_URL}`, songDetails);
      if (!response.status === 201) throw new Error('An error occured, please try again.');
      return await response.data; 
    } catch (error) {
      throw error;
    }
  };

  export const putSong = async (songId, songData) => {
    try {
        console.log(songId, songData);
      const response = await axios.put(`${BASE_URL}/${songId}`, songData);
      console.log(response)
      if (!response.status === 200) throw new Error('Failed to update the song');
      return await response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteSongApi = async (songId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${songId}`);
      if (response.status !== 200) throw new Error('Failed to delete the song');
      return response.data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error; 
    }
  };