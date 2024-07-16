import { postNewSong, putSong, deleteSongApi } from '../api/songApi';

export const addNewSong = async (songData) => {
    return await postNewSong(songData);
};

export const updateSong = async (songId, songData) => {
    return await putSong(songId, songData);
};

export const deleteSong = (songId) => {
    return deleteSongApi(songId); 
};