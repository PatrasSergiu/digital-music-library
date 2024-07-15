import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';



function NewAlbumDialog({ open, onClose, onAdd, artists }) {
  const [newAlbumData, setNewAlbumData] = useState({
    title: '',
    artist: '',
    description: '',
    newArtist: ''
  });

  const defaultAlbumData = {
    title: '',
    artist: '',
    description: '',
    newArtist: ''
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  }

  const resetForm = () => {
    setNewAlbumData(defaultAlbumData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "artist" && value === "new") {
      setNewAlbumData({ ...newAlbumData, artist: value });
    } else {
      setNewAlbumData({ ...newAlbumData, [name]: value });
    }
  };

  const handleAdd = () => {
    if (newAlbumData.artist === "new" && newAlbumData.newArtist) {
      console.log("Add new artist:", newAlbumData.newArtist);
      resetForm();
      // Add new artist logic here
    }
    onAdd(newAlbumData);
    resetForm();
    onClose();
  };

  useEffect(() => {
    setNewAlbumData((prevState) => ({ ...prevState, newArtist: '', artist: '' }));
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#333', color: 'white' } }}>
      <DialogTitle>Add New Album</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Album Title"
          type="text"
          fullWidth
          variant="outlined"
          value={newAlbumData.title}
          onChange={handleChange}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Album Description"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={newAlbumData.description}
          onChange={handleChange}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
        <FormControl fullWidth sx={{ marginY: 2 }}>
          <InputLabel id="artist-label" sx={{ color: 'white' }}>Artist</InputLabel>
          <Select
            labelId="artist-label"
            id="artist-select"
            name="artist"
            value={newAlbumData.artist}
            onChange={handleChange}
            label="Artist"
            sx={{ color: 'white', backgroundColor: '#444', '&:hover': { backgroundColor: '#555' }, '.MuiSelect-select': { color: 'white' } }}
          >
            {artists.map((artist) => (
              <MenuItem key={artist.id} value={artist.name} sx={{ color: 'white', backgroundColor: '#333', '&:hover': { backgroundColor: '#222' } }}>
                {artist.name}
              </MenuItem>
            ))}
            <MenuItem value="new" sx={{ color: 'white', backgroundColor: '#333', '&:hover': { backgroundColor: '#222' } }}>Add New Artist...</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="newArtist"
          label="New Artist Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newAlbumData.newArtist}
          onChange={handleChange}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
          disabled={newAlbumData.artist !== "new"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleAdd} sx={{ color: 'white' }}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewAlbumDialog;
