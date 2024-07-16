import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { updateAlbum } from '../controllers/albumController';

function EditAlbumDialog({ open, onClose, album, onUpdate }) {
  const [editedAlbum, setEditedAlbum] = useState({
    title: album.title,
    description: album.description
  });

  const handleChange = (field, value) => {
    setEditedAlbum(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!editedAlbum.title.trim()) {
      toast.error("Album title cannot be empty!");
      return;
    }
    toast.promise(
      updateAlbum(album.id, editedAlbum),
      {
        pending: 'Updating album...',
        success: 'Album successfully updated!',
        error: 'Error updating album!'
      }
    ).then(updatedAlbum => {
      onUpdate(updatedAlbum);
      onClose();
    }).catch(error => {
      console.error("Failed to update album:", error);
    });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} PaperProps={{ style: { backgroundColor: '#333', color: 'white', width: 400 } }}>
      <DialogTitle>Edit Album</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Album Title"
          type="text"
          fullWidth
          variant="outlined"
          value={editedAlbum.title}
          onChange={(e) => handleChange('title', e.target.value)}
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
          rows={4}
          variant="outlined"
          value={editedAlbum.description}
          onChange={(e) => handleChange('description', e.target.value)}
          InputProps={{ style: { color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleUpdate} sx={{ color: 'white' }}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditAlbumDialog;