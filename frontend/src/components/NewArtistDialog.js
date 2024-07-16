import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { addNewArtist, updateArtist } from '../controllers/artistController';

function NewArtistDialog({ open, onClose, onAdd, onUpdate, artist, isEdit }) {
  const [artistName, setArtistName] = useState('');

  // Initialize the state based on whether it is in edit mode or not
  useEffect(() => {
    if (isEdit && artist) {
      setArtistName(artist.name);
    } else {
      setArtistName('');
    }
  }, [artist, isEdit]);

  const handleSave = async () => {
    if (!artistName.trim()) {
      toast.error("Artist name cannot be empty!");
      return;
    }
    const action = isEdit ? updateArtist(artist.id, {name: artistName}) : addNewArtist({ name: artistName });

    toast.promise(
      action,
      {
        pending: isEdit ? 'Updating artist...' : 'Adding new artist...',
        success: isEdit ? 'Artist updated successfully!' : 'Artist successfully added!',
        error: 'Error processing artist!'
      }
    ).then(result => {
      console.log("in result", result);
      isEdit ? onUpdate(result) : onAdd(result);
      setArtistName('');
      onClose();
    }).catch(error => {
      console.error("Failed to process artist:", error);
    });
  };

  const handleCancel = () => {
    setArtistName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} PaperProps={{ style: { backgroundColor: '#333', color: 'white', width: 400 } }}>
      <DialogTitle>{isEdit ? 'Edit Artist' : 'Add New Artist'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="artistName"
          label="Artist Name"
          type="text"
          fullWidth
          variant="outlined"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleSave} sx={{ color: 'white' }}>{isEdit ? 'Save Changes' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewArtistDialog;
